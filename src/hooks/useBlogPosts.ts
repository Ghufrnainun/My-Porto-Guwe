import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  featured_image: string | null;
  category_id: string | null;
  author_id: string;
  published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  category?: { name: string; slug: string } | null;
  tags?: { id: string; name: string; slug: string }[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
}

// Fetch published blog posts for public view
export function usePublishedPosts() {
  return useQuery({
    queryKey: ["blog-posts", "published"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select(`
          *,
          category:categories(name, slug)
        `)
        .eq("published", true)
        .order("published_at", { ascending: false });

      if (error) throw error;

      // Fetch tags for each post
      const postsWithTags = await Promise.all(
        (data || []).map(async (post) => {
          const { data: tagData } = await supabase
            .from("blog_post_tags")
            .select("tag_id, tags(id, name, slug)")
            .eq("blog_post_id", post.id);

          return {
            ...post,
            tags: tagData?.map((t: any) => t.tags) || [],
          };
        })
      );

      return postsWithTags as BlogPost[];
    },
  });
}

// Fetch all blog posts for admin
export function useAllPosts() {
  return useQuery({
    queryKey: ["blog-posts", "all"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select(`
          *,
          category:categories(name, slug)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;

      const postsWithTags = await Promise.all(
        (data || []).map(async (post) => {
          const { data: tagData } = await supabase
            .from("blog_post_tags")
            .select("tag_id, tags(id, name, slug)")
            .eq("blog_post_id", post.id);

          return {
            ...post,
            tags: tagData?.map((t: any) => t.tags) || [],
          };
        })
      );

      return postsWithTags as BlogPost[];
    },
  });
}

// Fetch single blog post by slug
export function usePostBySlug(slug: string) {
  return useQuery({
    queryKey: ["blog-post", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select(`
          *,
          category:categories(name, slug)
        `)
        .eq("slug", slug)
        .maybeSingle();

      if (error) throw error;
      if (!data) return null;

      // Fetch tags
      const { data: tagData } = await supabase
        .from("blog_post_tags")
        .select("tag_id, tags(id, name, slug)")
        .eq("blog_post_id", data.id);

      return {
        ...data,
        tags: tagData?.map((t: any) => t.tags) || [],
      } as BlogPost;
    },
    enabled: !!slug,
  });
}

// Fetch categories
export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("name");

      if (error) throw error;
      return data as Category[];
    },
  });
}

// Fetch tags
export function useTags() {
  return useQuery({
    queryKey: ["tags"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tags")
        .select("*")
        .order("name");

      if (error) throw error;
      return data as Tag[];
    },
  });
}

// Create blog post
export function useCreatePost() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (post: {
      title: string;
      slug: string;
      content: string;
      excerpt?: string;
      featured_image?: string;
      category_id?: string;
      published?: boolean;
      tag_ids?: string[];
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { tag_ids, ...postData } = post;

      const { data, error } = await supabase
        .from("blog_posts")
        .insert({
          ...postData,
          author_id: user.id,
          published_at: post.published ? new Date().toISOString() : null,
        })
        .select()
        .single();

      if (error) throw error;

      // Insert tags
      if (tag_ids && tag_ids.length > 0) {
        const { error: tagError } = await supabase
          .from("blog_post_tags")
          .insert(tag_ids.map(tagId => ({
            blog_post_id: data.id,
            tag_id: tagId,
          })));

        if (tagError) throw tagError;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blog-posts"] });
      toast({
        title: "Success",
        description: "Blog post created successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

// Update blog post
export function useUpdatePost() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({
      id,
      ...post
    }: {
      id: string;
      title?: string;
      slug?: string;
      content?: string;
      excerpt?: string;
      featured_image?: string;
      category_id?: string | null;
      published?: boolean;
      tag_ids?: string[];
    }) => {
      const { tag_ids, ...postData } = post;

      // Handle published_at
      const updateData: any = { ...postData };
      if (post.published !== undefined) {
        updateData.published_at = post.published ? new Date().toISOString() : null;
      }

      const { data, error } = await supabase
        .from("blog_posts")
        .update(updateData)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      // Update tags
      if (tag_ids !== undefined) {
        // Remove existing tags
        await supabase
          .from("blog_post_tags")
          .delete()
          .eq("blog_post_id", id);

        // Insert new tags
        if (tag_ids.length > 0) {
          const { error: tagError } = await supabase
            .from("blog_post_tags")
            .insert(tag_ids.map(tagId => ({
              blog_post_id: id,
              tag_id: tagId,
            })));

          if (tagError) throw tagError;
        }
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blog-posts"] });
      queryClient.invalidateQueries({ queryKey: ["blog-post"] });
      toast({
        title: "Success",
        description: "Blog post updated successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

// Delete blog post
export function useDeletePost() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("blog_posts")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blog-posts"] });
      toast({
        title: "Success",
        description: "Blog post deleted successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

// Upload image to storage
export async function uploadBlogImage(file: File): Promise<string> {
  const fileExt = file.name.split(".").pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

  const { error } = await supabase.storage
    .from("blog-images")
    .upload(fileName, file);

  if (error) throw error;

  const { data } = supabase.storage
    .from("blog-images")
    .getPublicUrl(fileName);

  return data.publicUrl;
}

import React, { useEffect, useRef, useState } from 'react';
import {
  Check,
  Info,
  Paintbrush,
  Search,
  Send,
  Image as ImageIcon,
  Sun,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  certifications,
  education,
  organizationExperience,
  profile,
  skillTiers,
} from '@/data/profile';
import { featuredProjects } from '@/data/featuredProjects';
import {
  useOsNote,
  useWindowFocus,
  WALLPAPERS,
  type OsAppearance,
  type OsAppId,
  type SettingsPaneId,
} from '@/components/os/OsShellContext';
import {
  Avatar,
  SettingsGroup,
  SettingsRow,
  Sidebar,
  Toolbar,
  ToolbarButton,
  ToolbarGroup,
} from '@/components/os/OsWindowChrome';

const settingsPanes: {
  id: SettingsPaneId;
  label: string;
  color: string;
  icon: React.ReactNode;
}[] = [
  {
    id: 'appearance',
    label: 'Appearance',
    color: 'bg-[#3a3a3c]',
    icon: <Paintbrush size={13} className="text-white" />,
  },
  {
    id: 'wallpaper',
    label: 'Wallpaper',
    color: 'bg-[#30b0c7]',
    icon: <ImageIcon size={13} className="text-white" />,
  },
  {
    id: 'displays',
    label: 'Displays',
    color: 'bg-[#0a84ff]',
    icon: <Sun size={13} className="text-white" />,
  },
  {
    id: 'about',
    label: 'About',
    color: 'bg-[#8e8e93]',
    icon: <Info size={13} className="text-white" />,
  },
];

const appearanceOptions: { id: OsAppearance; label: string; preview: string }[] = [
  {
    id: 'auto',
    label: 'Auto',
    preview: 'bg-[linear-gradient(135deg,#e5e5e5_50%,#2c2c2e_50%)]',
  },
  {
    id: 'light',
    label: 'Light',
    preview: 'bg-gradient-to-br from-[#f5f5f7] to-[#d1d1d6]',
  },
  {
    id: 'dark',
    label: 'Dark',
    preview: 'bg-gradient-to-br from-[#48484a] to-[#1c1c1e]',
  },
];

export const SystemSettingsApp: React.FC = () => {
  const {
    appearance,
    setAppearance,
    wallpaperId,
    setWallpaperId,
    autoRotateWallpaper,
    setAutoRotateWallpaper,
    brightness,
    setBrightness,
    settingsPane,
    setSettingsPane,
  } = useOsNote();

  const currentPane =
    settingsPanes.find((p) => p.id === settingsPane) ?? settingsPanes[3];
  const currentWallpaper =
    WALLPAPERS.find((w) => w.id === wallpaperId) ?? WALLPAPERS[0];

  return (
    <div className="flex h-full">
      <Sidebar
        selectedId={currentPane.id}
        onSelect={(id) => setSettingsPane(id as SettingsPaneId)}
        header={
          <button
            type="button"
            onClick={() => setSettingsPane('about')}
            className="mx-2.5 mb-3 flex cursor-default items-center gap-2.5 rounded-lg px-2 py-1.5 text-left hover:bg-black/5 dark:hover:bg-white/5"
          >
            <Avatar className="h-9 w-9 text-[13px]" />
            <div className="min-w-0">
              <div className="truncate text-[13px] font-semibold">
                {profile.name}
              </div>
              <div className="truncate text-[11px] text-black/50 dark:text-white/50">
                Full-Stack Developer
              </div>
            </div>
          </button>
        }
        sections={[
          {
            items: settingsPanes.map(({ id, label, color, icon }) => ({
              id,
              label,
              icon: (
                <span
                  className={cn(
                    'flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-[6px] shadow-sm',
                    color,
                  )}
                >
                  {icon}
                </span>
              ),
            })),
          },
        ]}
      />
      <section className="flex min-w-0 flex-grow flex-col bg-[#f2f2f7] dark:bg-[#282025]">
        <Toolbar className="max-sm:pl-[92px]" title={currentPane.label} />
        <div className="flex-grow space-y-4 overflow-y-auto px-5 pb-6">
          {currentPane.id === 'appearance' && (
            <>
              <SettingsGroup>
                <SettingsRow label="Appearance">
                  <div className="flex gap-4 py-1">
                    {appearanceOptions.map((option) => (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => setAppearance(option.id)}
                        className="flex cursor-default flex-col items-center gap-1.5"
                      >
                        <div
                          className={cn(
                            'h-[44px] w-[68px] rounded-lg ring-1 ring-black/10',
                            option.preview,
                            appearance === option.id && 'ring-[3px] ring-[#0a84ff]',
                          )}
                        />
                        <span
                          className={cn(
                            'text-[11px]',
                            appearance === option.id
                              ? 'font-semibold'
                              : 'text-black/60 dark:text-white/60',
                          )}
                        >
                          {option.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </SettingsRow>
                <SettingsRow label="Auto-rotate wallpaper (2 min)">
                  <button
                    type="button"
                    role="switch"
                    aria-checked={autoRotateWallpaper}
                    onClick={() =>
                      setAutoRotateWallpaper((current) => !current)
                    }
                    className={cn(
                      'relative h-6 w-11 rounded-full transition-colors',
                      autoRotateWallpaper
                        ? 'bg-[#0a84ff]'
                        : 'bg-black/15 dark:bg-white/20',
                    )}
                  >
                    <span
                      className={cn(
                        'block h-5 w-5 rounded-full bg-white shadow transition-transform',
                        autoRotateWallpaper ? 'translate-x-5' : 'translate-x-0.5',
                      )}
                    />
                  </button>
                </SettingsRow>
              </SettingsGroup>
            </>
          )}

          {currentPane.id === 'wallpaper' && (
            <>
              <SettingsGroup>
                <div className="flex items-center gap-4 py-3">
                  <div
                    className="relative aspect-video w-36 shrink-0 overflow-hidden rounded-lg ring-1 ring-black/10"
                    style={{ background: currentWallpaper.preview }}
                  />
                  <div>
                    <div className="font-semibold">{currentWallpaper.label}</div>
                    <div className="text-[12px] text-black/50 dark:text-white/50">
                      {currentWallpaper.subtitle}
                    </div>
                  </div>
                </div>
              </SettingsGroup>
              <div className="grid grid-cols-[repeat(auto-fill,minmax(120px,1fr))] gap-3">
                {WALLPAPERS.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setWallpaperId(item.id)}
                    className={cn(
                      'relative aspect-video cursor-default overflow-hidden rounded-lg ring-1 ring-black/10',
                      wallpaperId === item.id &&
                        'ring-[3px] ring-[#0a84ff] ring-offset-2 ring-offset-[#f2f2f7] dark:ring-offset-[#282025]',
                    )}
                    style={{ background: item.preview }}
                    title={item.label}
                  >
                    <span className="sr-only">{item.label}</span>
                  </button>
                ))}
              </div>
            </>
          )}

          {currentPane.id === 'displays' && (
            <SettingsGroup>
              <SettingsRow label="Brightness">
                <div className="flex w-56 items-center gap-2">
                  <Sun size={12} className="opacity-50" />
                  <input
                    type="range"
                    min={0.35}
                    max={1}
                    step={0.01}
                    value={brightness}
                    onChange={(event) =>
                      setBrightness(Number(event.target.value))
                    }
                    className="flex-grow accent-[#0a84ff]"
                    aria-label="Display brightness"
                  />
                  <Sun size={16} className="opacity-70" />
                </div>
              </SettingsRow>
            </SettingsGroup>
          )}

          {currentPane.id === 'about' && (
            <>
              <div className="flex flex-col items-center gap-2 py-4">
                <Avatar className="h-20 w-20 text-[30px]" />
                <div className="text-[20px] font-bold">{profile.name}</div>
                <div className="text-black/50 dark:text-white/50">
                  {profile.email}
                </div>
              </div>
              <SettingsGroup>
                <SettingsRow label="Name">
                  <span className="text-black/50 dark:text-white/50">
                    ghufron&apos;s Portfolio
                  </span>
                </SettingsRow>
                <SettingsRow label="Built with">
                  <span className="text-black/50 dark:text-white/50">
                    React, TypeScript, Tailwind CSS, Framer Motion
                  </span>
                </SettingsRow>
                <SettingsRow label="Source">
                  <a
                    href={profile.github}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#0a84ff] hover:underline"
                  >
                    View on GitHub
                  </a>
                </SettingsRow>
              </SettingsGroup>
            </>
          )}
        </div>
      </section>
    </div>
  );
};

const NOTES_UNCHECKED_KEY = 'ganos-notes-unchecked-v1';

const readUncheckedNotes = (): string[] => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = JSON.parse(
      window.localStorage.getItem(NOTES_UNCHECKED_KEY) ?? '[]',
    );
    return Array.isArray(raw) ? raw : [];
  } catch {
    return [];
  }
};

const ChecklistItem: React.FC<{ id: string; label: string }> = ({
  id,
  label,
}) => {
  const [isChecked, setIsChecked] = useState(
    () => !readUncheckedNotes().includes(id),
  );

  const toggle = () => {
    const unchecked = readUncheckedNotes().filter((item) => item !== id);
    const next = isChecked ? [...unchecked, id] : unchecked;
    try {
      window.localStorage.setItem(NOTES_UNCHECKED_KEY, JSON.stringify(next));
    } catch {
      /* ignore storage failures */
    }
    setIsChecked(!isChecked);
  };

  return (
    <li className="flex items-center gap-2">
      <motion.button
        type="button"
        role="checkbox"
        aria-checked={isChecked}
        aria-label={label}
        onClick={toggle}
        initial={false}
        animate={{ scale: isChecked ? [0.8, 1.15, 1] : [0.9, 1] }}
        transition={{ duration: 0.25 }}
        className={cn(
          'flex h-4 w-4 shrink-0 items-center justify-center rounded-full transition-colors duration-150',
          isChecked
            ? 'bg-[#ffd52e]'
            : 'ring-[1.5px] ring-inset ring-black/25 dark:ring-white/30',
        )}
      >
        {isChecked && <Check size={10} strokeWidth={3} className="text-black" />}
      </motion.button>
      <span>{label}</span>
    </li>
  );
};

export const NotesApp: React.FC<{ initialId?: string }> = ({ initialId }) => {
  const { note, setNote } = useOsNote();
  const isFocused = useWindowFocus();
  const [selectedId, setSelectedId] = useState(initialId ?? 'hello');
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (initialId) setSelectedId(initialId);
  }, [initialId]);

  const notes = [
    {
      id: 'hello',
      title: 'Hello 👋',
      date: 'Pinned',
      preview: `${education.degree} at ${education.university}`,
      content: (
        <>
          <p>
            I&apos;m {profile.name}. I build web and mobile products from{' '}
            {profile.location} — focusing on clean backend systems and
            interfaces that feel good to use.
          </p>
          <p>
            Currently a Computer Engineering student at {education.university}{' '}
            (Semester {profile.semester}, GPA {education.gpa}).
          </p>
          <p>
            Say hi at{' '}
            <a
              href={`mailto:${profile.email}`}
              className="text-[#b8860b] underline underline-offset-2 dark:text-[#ffd52e]"
            >
              {profile.email}
            </a>{' '}
            or find me on{' '}
            <a
              href={profile.github}
              target="_blank"
              rel="noreferrer"
              className="text-[#b8860b] underline underline-offset-2 dark:text-[#ffd52e]"
            >
              GitHub
            </a>{' '}
            and{' '}
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noreferrer"
              className="text-[#b8860b] underline underline-offset-2 dark:text-[#ffd52e]"
            >
              LinkedIn
            </a>
            .
          </p>
        </>
      ),
    },
    ...organizationExperience.map((exp, idx) => ({
      id: `exp-${idx}`,
      title: exp.organization,
      date: exp.period.split(' - ')[0] ?? exp.period,
      preview: exp.role,
      content: (
        <>
          <p className="text-neutral-500 dark:text-neutral-400">
            {exp.role} · {exp.period}
          </p>
          <ul className="list-disc space-y-1 pl-5">
            {exp.responsibilities.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </>
      ),
    })),
    {
      id: 'skills',
      title: 'Skills',
      date: 'Always learning',
      preview: skillTiers
        .flatMap((t) => t.skills.map((s) => s.name))
        .slice(0, 5)
        .join(', '),
      content: (
        <>
          {skillTiers.map((tier) => (
            <div key={tier.label}>
              <h3 className="font-semibold">{tier.label}</h3>
              <ul className="mt-1.5 space-y-1">
                {tier.skills.map((skill) => (
                  <ChecklistItem
                    key={skill.name}
                    id={`${tier.label}/${skill.name}`}
                    label={skill.name}
                  />
                ))}
              </ul>
            </div>
          ))}
        </>
      ),
    },
    {
      id: 'certifications',
      title: 'Certifications',
      date: certifications[0]?.year ?? '2025',
      preview: certifications.map((c) => c.title).join(', '),
      content: (
        <>
          {certifications.map((cert) => (
            <div key={cert.title}>
              <h3 className="font-semibold">{cert.title}</h3>
              <p className="text-neutral-500 dark:text-neutral-400">
                {cert.issuer} · {cert.year}
                {cert.score ? ` · ${cert.score}` : ''}
                {cert.credentialId ? ` · ID ${cert.credentialId}` : ''}
              </p>
            </div>
          ))}
        </>
      ),
    },
    {
      id: 'scratchpad',
      title: 'Scratchpad',
      date: 'Editable',
      preview: note,
      content: (
        <textarea
          aria-label="Personal note"
          value={note}
          onChange={(event) => setNote(event.target.value)}
          className="min-h-60 w-full resize-none bg-transparent text-[15px] leading-7 outline-none"
        />
      ),
    },
  ];

  const filteredNotes = notes.filter((item) =>
    `${item.title} ${item.preview}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );
  const selectedNote =
    notes.find((item) => item.id === selectedId) ?? notes[0];

  return (
    <div className="flex h-full">
      <aside className="flex w-40 shrink-0 select-none flex-col border-r border-black/5 sm:w-64 dark:border-white/[0.06]">
        <div className="handle h-[52px] shrink-0" />
        <div className="px-3 pb-2">
          <div className="flex h-8 items-center gap-1.5 rounded-full bg-black/5 px-2.5 dark:bg-white/[0.08]">
            <Search size={13} className="opacity-50" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search"
              className="w-full bg-transparent text-[13px] outline-none placeholder:text-black/40 dark:placeholder:text-white/40"
            />
          </div>
        </div>
        <div className="flex-grow overflow-y-auto px-2.5 pb-2">
          {filteredNotes.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setSelectedId(item.id)}
              className={cn(
                'w-full cursor-default rounded-[10px] px-3 py-2 text-left',
                selectedNote.id === item.id &&
                  (isFocused
                    ? 'bg-[#ffd52e] text-black dark:bg-[#6e5815] dark:text-white'
                    : 'bg-black/10 dark:bg-white/10'),
              )}
            >
              <div className="truncate font-bold">{item.title}</div>
              <div className="flex gap-2 text-[12px]">
                <span className="shrink-0">{item.date}</span>
                <span className="truncate opacity-60">{item.preview}</span>
              </div>
            </button>
          ))}
        </div>
      </aside>
      <article className="flex min-w-0 flex-grow flex-col bg-white dark:bg-[#1e1e1e]">
        <Toolbar />
        <div className="selectable flex-grow overflow-y-auto px-6 pb-8 selection:bg-[#ffd52e]/45 sm:px-12">
          <div className="mb-4 text-center text-[12px] text-black/40 dark:text-white/40">
            {selectedNote.date}
          </div>
          <h1 className="mb-4 text-[26px] font-bold">{selectedNote.title}</h1>
          <div className="max-w-prose space-y-4 text-[14px] leading-relaxed">
            {selectedNote.content}
          </div>
        </div>
      </article>
    </div>
  );
};

interface TerminalEntry {
  id: number;
  input: string;
  output: React.ReactNode;
}

export const TerminalApp: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { openApp } = useOsNote();
  const [entries, setEntries] = useState<TerminalEntry[]>([]);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const nextId = useRef(0);
  const [lastLogin] = useState(() =>
    new Date().toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    }),
  );

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: 'end' });
  }, [entries]);

  const openTargets: Record<string, { label: string; run: () => void }> = {
    projects: { label: 'Projects (Finder)', run: () => openApp('projects') },
    about: { label: 'About Me (Contacts)', run: () => openApp('about') },
    cv: { label: 'CV.pdf (Preview)', run: () => openApp('resume') },
    resume: { label: 'CV.pdf (Preview)', run: () => openApp('resume') },
    blog: { label: 'Writing Log', run: () => openApp('blog') },
    notes: { label: 'Notes', run: () => openApp('notes') },
    mail: { label: 'Mail', run: () => openApp('mail') },
    settings: { label: 'System Settings', run: () => openApp('settings') },
    github: {
      label: 'GitHub',
      run: () => window.open(profile.github, '_blank', 'noreferrer'),
    },
    linkedin: {
      label: 'LinkedIn',
      run: () => window.open(profile.linkedin, '_blank', 'noreferrer'),
    },
  };

  const runCommand = (raw: string): React.ReactNode => {
    const [cmd, ...args] = raw.trim().split(/\s+/);
    if (!cmd) return null;
    const name = cmd.toLowerCase();

    if (name === 'help') {
      return (
        <div className="grid grid-cols-[120px_1fr] gap-y-0.5">
          <span className="text-cyan-400">whoami</span>
          <span>who is this guy?</span>
          <span className="text-cyan-400">projects</span>
          <span>featured builds and case studies</span>
          <span className="text-cyan-400">skills</span>
          <span>languages, frameworks &amp; tools</span>
          <span className="text-cyan-400">contact</span>
          <span>how to reach me</span>
          <span className="text-cyan-400">open &lt;app&gt;</span>
          <span>open an app (projects, about, cv, notes, mail, settings)</span>
          <span className="text-cyan-400">ls / cat</span>
          <span>list or inspect files</span>
          <span className="text-cyan-400">neofetch</span>
          <span>system information</span>
          <span className="text-cyan-400">clear / exit</span>
          <span>clear terminal or close window</span>
        </div>
      );
    }
    if (name === 'whoami')
      return `${profile.name} — Full-Stack Developer (${profile.location})`;
    if (name === 'projects') {
      return (
        <div>
          {featuredProjects.map((p) => (
            <div key={p.slug}>
              <span className="text-cyan-400">{p.title}</span>{' '}
              <span className="text-neutral-500">
                ({p.year} · {p.role})
              </span>
            </div>
          ))}
          <div className="mt-1 text-neutral-500">
            Run `open projects` to browse them in Finder.
          </div>
        </div>
      );
    }
    if (name === 'skills') {
      return (
        <div>
          {skillTiers.map((tier) => (
            <div key={tier.label}>
              <span className="text-cyan-400">{tier.label}:</span>{' '}
              {tier.skills.map((s) => s.name).join(', ')}
            </div>
          ))}
        </div>
      );
    }
    if (name === 'contact') {
      return (
        <div className="grid grid-cols-[90px_1fr]">
          <span className="text-cyan-400">email</span>
          <a href={`mailto:${profile.email}`} className="underline">
            {profile.email}
          </a>
          <span className="text-cyan-400">github</span>
          <a
            href={profile.github}
            target="_blank"
            rel="noreferrer"
            className="underline"
          >
            {profile.github}
          </a>
          <span className="text-cyan-400">linkedin</span>
          <a
            href={profile.linkedin}
            target="_blank"
            rel="noreferrer"
            className="underline"
          >
            {profile.linkedin}
          </a>
        </div>
      );
    }
    if (name === 'open') {
      const targetKey = (args[0] ?? '').toLowerCase();
      if (!targetKey)
        return `usage: open <${Object.keys(openTargets).join(' | ')}>`;
      const target = openTargets[targetKey];
      if (!target)
        return `The file /Users/ghufron/${targetKey} does not exist.`;
      target.run();
      return `Opening ${target.label}...`;
    }
    if (name === 'ls') {
      return (
        <div className="flex flex-wrap gap-x-6">
          <span>about.txt</span>
          <span>skills.txt</span>
          <span>CV.pdf</span>
          <span className="font-bold text-blue-400">projects</span>
        </div>
      );
    }
    if (name === 'cat') {
      const file = args[0];
      if (!file) return 'usage: cat <file>';
      if (file === 'about.txt')
        return `${profile.name} — ${education.degree} at ${education.university} (GPA ${education.gpa}).`;
      if (file === 'skills.txt')
        return skillTiers
          .map((t) => `${t.label}: ${t.skills.map((s) => s.name).join(', ')}`)
          .join('\n');
      if (file === 'CV.pdf') return 'cat: CV.pdf: binary file. Try `open cv`';
      return `cat: ${file}: No such file or directory`;
    }
    if (name === 'neofetch') {
      return (
        <div className="flex gap-6">
          <pre className="leading-tight text-green-400">{`        .:'
    __ :'__
 .'\`__\`-'__\`\`.
:__________.-'
:_________:
 :_________\`-;
  \`.__.-.__.'`}</pre>
          <div>
            <div>
              <span className="text-cyan-400">ghufron</span>@
              <span className="text-cyan-400">portfolio</span>
            </div>
            <div>-----------------</div>
            <div>
              <span className="text-cyan-400">OS:</span> macOS Portfolio
            </div>
            <div>
              <span className="text-cyan-400">Host:</span> {profile.name}
            </div>
            <div>
              <span className="text-cyan-400">Location:</span> {profile.location}
            </div>
            <div>
              <span className="text-cyan-400">Shell:</span> zsh
            </div>
          </div>
        </div>
      );
    }
    if (name === 'date') return new Date().toString();
    if (name === 'echo') return args.join(' ');
    if (name === 'pwd') return '/Users/ghufron';
    if (name === 'sudo') return 'Nice try. This incident will be reported.';
    if (name === 'exit') {
      onClose();
      return null;
    }
    return `zsh: command not found: ${name}`;
  };

  const submit = () => {
    const trimmed = input.trim();
    const nextHistory = trimmed ? [...history, trimmed] : history;
    if (trimmed.toLowerCase() === 'clear') {
      setEntries([]);
      setHistory(nextHistory);
      setHistoryIndex(null);
      setInput('');
      return;
    }
    const output = runCommand(input);
    setHistory(nextHistory);
    setHistoryIndex(null);
    setInput('');
    setEntries((prev) => [
      ...prev,
      { id: nextId.current++, input, output },
    ]);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      submit();
    } else if (event.key === 'ArrowUp' && history.length) {
      event.preventDefault();
      const idx =
        historyIndex === null
          ? history.length - 1
          : Math.max(0, historyIndex - 1);
      setHistoryIndex(idx);
      setInput(history[idx] ?? '');
    } else if (event.key === 'ArrowDown' && history.length) {
      event.preventDefault();
      if (historyIndex === null) return;
      const next = historyIndex + 1;
      if (next >= history.length) {
        setHistoryIndex(null);
        setInput('');
      } else {
        setHistoryIndex(next);
        setInput(history[next] ?? '');
      }
    } else if (event.key === 'l' && event.ctrlKey) {
      event.preventDefault();
      setEntries([]);
    }
  };

  return (
    <div className="flex h-full flex-col bg-[#1e1e1e]/95 text-[#f2f2f2]">
      <Toolbar
        hasControls
        centerTitle
        title={
          <span className="text-[13px] font-semibold text-white/70">
            ghufron — -zsh
          </span>
        }
        className="h-[52px] border-b border-black/60"
      />
      <div
        className="selectable flex-grow cursor-text overflow-y-auto p-3 font-mono text-[12px] leading-relaxed"
        onClick={() => {
          if (!window.getSelection()?.toString()) inputRef.current?.focus();
        }}
      >
        <div>Last login: {lastLogin} on ttys000</div>
        <div className="mb-1 text-neutral-400">
          Type `help` to see what you can do here.
        </div>
        {entries.map((entry) => (
          <div key={entry.id}>
            <div className="flex">
              <span className="mr-2 shrink-0">
                <span className="text-green-400">ghufron@portfolio</span>{' '}
                <span className="text-blue-400">~</span> %
              </span>
              <span className="break-all">{entry.input}</span>
            </div>
            {entry.output && (
              <div className="whitespace-pre-wrap break-words">
                {entry.output}
              </div>
            )}
          </div>
        ))}
        <div className="flex" ref={bottomRef}>
          <span className="mr-2 shrink-0">
            <span className="text-green-400">ghufron@portfolio</span>{' '}
            <span className="text-blue-400">~</span> %
          </span>
          <input
            ref={inputRef}
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-grow bg-transparent caret-neutral-200 outline-none"
            spellCheck={false}
            autoCapitalize="off"
            autoComplete="off"
            autoFocus
          />
        </div>
      </div>
    </div>
  );
};

export const MailApp: React.FC = () => {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const canSend = subject.trim().length > 0 && message.trim().length > 0;

  const handleSend = () => {
    if (!canSend) return;
    const params = new URLSearchParams({ subject, body: message });
    window.location.href = `mailto:${profile.email}?${params
      .toString()
      .replace(/\+/g, '%20')}`;
  };

  return (
    <div className="flex h-full flex-col bg-white dark:bg-[#282025]">
      <Toolbar
        hasControls
        title={subject.trim() || 'New Message'}
        trailing={
          <ToolbarGroup>
            <ToolbarButton
              icon={<Send size={15} />}
              title="Send"
              disabled={!canSend}
              onClick={handleSend}
              className="enabled:text-[#0a84ff]"
            />
          </ToolbarGroup>
        }
      />
      <div className="mx-4 flex h-9 items-center gap-2 border-b border-black/5 dark:border-white/10">
        <div className="w-14 text-black/45 dark:text-white/45">To:</div>
        <span className="rounded-full bg-[#0a84ff]/15 px-2 py-0.5 text-[#0a84ff]">
          {profile.name}
        </span>
      </div>
      <div className="mx-4 flex h-9 items-center gap-2 border-b border-black/5 dark:border-white/10">
        <div className="w-14 text-black/45 dark:text-white/45">Subject:</div>
        <input
          value={subject}
          onChange={(event) => setSubject(event.target.value)}
          className="flex-grow bg-transparent outline-none"
          autoFocus
        />
      </div>
      <textarea
        value={message}
        onChange={(event) => setMessage(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
            handleSend();
          }
        }}
        placeholder={`Hi ${profile.name.split(' ')[0]},\n\n`}
        className="flex-grow resize-none bg-transparent p-4 text-[14px] leading-relaxed outline-none placeholder:text-black/30 dark:placeholder:text-white/30"
      />
      <div className="border-t border-black/5 px-4 py-2 text-[11px] text-black/40 dark:border-white/5 dark:text-white/40">
        Sending opens your mail app with this message ready to go.
      </div>
    </div>
  );
};

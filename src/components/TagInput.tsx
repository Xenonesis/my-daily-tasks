import { useState, KeyboardEvent } from 'react';
import { X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
}

const tagColors = [
  'bg-blue-500/20 text-blue-700 dark:text-blue-300 border-blue-500/30',
  'bg-green-500/20 text-green-700 dark:text-green-300 border-green-500/30',
  'bg-purple-500/20 text-purple-700 dark:text-purple-300 border-purple-500/30',
  'bg-orange-500/20 text-orange-700 dark:text-orange-300 border-orange-500/30',
  'bg-pink-500/20 text-pink-700 dark:text-pink-300 border-pink-500/30',
  'bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 border-cyan-500/30',
];

function getTagColor(tag: string): string {
  let hash = 0;
  for (let i = 0; i < tag.length; i++) {
    hash = tag.charCodeAt(i) + ((hash << 5) - hash);
  }
  return tagColors[Math.abs(hash) % tagColors.length];
}

export function TagInput({ tags, onChange, disabled, placeholder = 'Add tag...', className }: TagInputProps) {
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag();
    } else if (e.key === 'Backspace' && inputValue === '' && tags.length > 0) {
      removeTag(tags.length - 1);
    }
  };

  const addTag = () => {
    const newTag = inputValue.trim().toLowerCase();
    if (newTag && !tags.includes(newTag)) {
      onChange([...tags, newTag]);
    }
    setInputValue('');
  };

  const removeTag = (index: number) => {
    onChange(tags.filter((_, i) => i !== index));
  };

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex flex-wrap gap-1.5">
        {tags.map((tag, index) => (
          <Badge
            key={tag}
            variant="outline"
            className={cn('text-xs gap-1 pr-1', getTagColor(tag))}
          >
            {tag}
            {!disabled && (
              <button
                type="button"
                onClick={() => removeTag(index)}
                className="hover:bg-foreground/10 rounded-full p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </Badge>
        ))}
      </div>
      <Input
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={addTag}
        disabled={disabled}
        placeholder={tags.length === 0 ? placeholder : 'Add another...'}
        className="h-8 text-sm"
      />
      <p className="text-xs text-muted-foreground">Press Enter or comma to add a tag</p>
    </div>
  );
}

export function TagDisplay({ tags }: { tags: string[] }) {
  if (tags.length === 0) return null;
  
  return (
    <div className="flex flex-wrap gap-1">
      {tags.map((tag) => (
        <Badge
          key={tag}
          variant="outline"
          className={cn('text-xs', getTagColor(tag))}
        >
          {tag}
        </Badge>
      ))}
    </div>
  );
}

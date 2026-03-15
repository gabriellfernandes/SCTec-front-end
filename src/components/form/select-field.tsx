import { useEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';

export type SelectFieldOption = {
  value: string;
  label: string;
  disabled?: boolean;
  tooltip?: string;
};

type SelectFieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectFieldOption[];
  disabled?: boolean;
  filterPlaceholder?: string;
  emptyText?: string;
  helperText?: string;
  showFilterInput?: boolean;
};

export function SelectField({
  id,
  label,
  value,
  onChange,
  options,
  disabled = false,
  filterPlaceholder = 'Digite para filtrar',
  emptyText = 'Nenhuma opcao encontrada',
  helperText,
  showFilterInput = true,
}: SelectFieldProps) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState('');
  const [hoveredTooltip, setHoveredTooltip] = useState('');

  const filteredOptions = useMemo(() => {
    const normalizedFilter = filter.trim().toLocaleLowerCase('pt-BR');

    if (!normalizedFilter) {
      return options;
    }

    return options.filter((option) =>
      option.label.toLocaleLowerCase('pt-BR').includes(normalizedFilter),
    );
  }, [filter, options]);

  const selectedOptionLabel = useMemo(() => {
    return options.find((option) => option.value === value)?.label ?? 'Selecione';
  }, [options, value]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const timeout = window.setTimeout(() => {
      searchInputRef.current?.focus();
    }, 0);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [isOpen]);

  useEffect(() => {
    function handleDocumentClick(event: MouseEvent): void {
      const target = event.target;

      if (!(target instanceof Node)) {
        return;
      }

      if (!wrapperRef.current?.contains(target)) {
        setIsOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent): void {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }

    window.addEventListener('mousedown', handleDocumentClick);
    window.addEventListener('keydown', handleEscape);

    return () => {
      window.removeEventListener('mousedown', handleDocumentClick);
      window.removeEventListener('keydown', handleEscape);
    };
  }, []);

  function handleSelectOption(nextValue: string, nextDisabled?: boolean): void {
    if (nextDisabled) {
      return;
    }

    onChange(nextValue);
    setIsOpen(false);
    setFilter('');
    setHoveredTooltip('');
  }

  return (
    <Wrapper ref={wrapperRef}>
      <label htmlFor={id}>{label}</label>

      <TriggerButton
        id={id}
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        disabled={disabled}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <span>{selectedOptionLabel}</span>
        <span aria-hidden="true">▾</span>
      </TriggerButton>

      {isOpen ? (
        <Dropdown role="listbox" aria-label={label}>
          {showFilterInput ? (
            <SearchInput
              ref={searchInputRef}
              value={filter}
              onChange={(event) => setFilter(event.target.value)}
              placeholder={filterPlaceholder}
              disabled={disabled}
            />
          ) : null}

          {filteredOptions.length > 0 ? (
            <OptionsList>
              {filteredOptions.map((option) => (
                <OptionButton
                  key={option.value}
                  type="button"
                  role="option"
                  aria-selected={value === option.value}
                  aria-disabled={option.disabled ? 'true' : 'false'}
                  onClick={() => handleSelectOption(option.value, option.disabled)}
                  onMouseEnter={() => setHoveredTooltip(option.disabled ? option.tooltip ?? '' : '')}
                  onMouseLeave={() => setHoveredTooltip('')}
                  $selected={value === option.value}
                  $disabled={Boolean(option.disabled)}
                >
                  <span>{option.label}</span>
                  {option.disabled ? <em>indisponivel</em> : null}
                </OptionButton>
              ))}
            </OptionsList>
          ) : (
            <EmptyState>{emptyText}</EmptyState>
          )}

          {hoveredTooltip ? <TooltipHint>{hoveredTooltip}</TooltipHint> : null}
        </Dropdown>
      ) : null}

      {helperText ? <small>{helperText}</small> : null}
    </Wrapper>
  );
}

const Wrapper = styled.div`
  position: relative;
  display: grid;
  gap: 8px;

  label {
    font-size: 0.82rem;
    font-weight: 700;
    color: #496285;
  }

  input,
  select {
    height: 36px;
    border: 1px solid #cfd9e8;
    border-radius: 8px;
    padding: 0 10px;
    background: #f9fbff;
    color: #1f3658;
  }

  small {
    color: #4f6d94;
    font-size: 0.75rem;
    line-height: 1.2;
  }
`;

const TriggerButton = styled.button`
  height: 36px;
  border: 1px solid #cfd9e8;
  border-radius: 8px;
  padding: 0 10px;
  background: #f9fbff;
  color: #1f3658;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

const Dropdown = styled.div`
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  z-index: 80;
  border: 1px solid #cfd9e8;
  border-radius: 10px;
  background: #ffffff;
  box-shadow: 0 12px 28px rgba(17, 34, 58, 0.16);
  padding: 8px;
  display: grid;
  gap: 8px;
`;

const SearchInput = styled.input`
  height: 34px;
  border: 1px solid #cfd9e8;
  border-radius: 8px;
  padding: 0 10px;
  background: #f9fbff;
  color: #1f3658;
`;

const OptionsList = styled.div`
  max-height: 220px;
  overflow-y: auto;
  display: grid;
  gap: 4px;
`;

const OptionButton = styled.button<{ $selected: boolean; $disabled: boolean }>`
  height: 34px;
  border: 1px solid ${({ $selected }) => ($selected ? '#89b8e8' : '#e4ecf7')};
  border-radius: 8px;
  background: ${({ $selected, $disabled }) =>
    $disabled ? '#f5f7fb' : $selected ? '#edf6ff' : '#ffffff'};
  color: #1f3658;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 10px;
  text-align: left;
  cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};

  opacity: ${({ $disabled }) => ($disabled ? 0.72 : 1)};

  em {
    font-style: normal;
    font-size: 0.72rem;
    color: #6b7f9f;
  }
`;

const EmptyState = styled.p`
  margin: 0;
  padding: 6px 4px;
  font-size: 0.82rem;
  color: #5f7394;
`;

const TooltipHint = styled.p`
  margin: 0;
  padding: 6px 8px;
  border: 1px solid #cfe0f6;
  border-radius: 8px;
  background: #f4f9ff;
  color: #355e8f;
  font-size: 0.78rem;
`;

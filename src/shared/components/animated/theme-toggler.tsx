'use client';

import { Monitor, Moon, Sun } from 'lucide-react';

import {
    ThemeToggler as ThemeTogglerPrimitive,
    type ThemeTogglerProps as ThemeTogglerPrimitiveProps,
    type ThemeSelection,
    type Resolved,
} from './effects/theme-toggler';
import { buttonVariants } from '../ui/button';
import type { VariantProps } from 'class-variance-authority';
import { cn } from '@/core/lib/utils';
import { useTheme } from '@/core/providers/theme-provider';

const getIcon = (
    effective: ThemeSelection,
    resolved: Resolved,
    modes: ThemeSelection[],
) => {
    const theme = modes.includes('system') ? effective : resolved;
    return theme === 'system' ? (
        <Monitor />
    ) : theme === 'dark' ? (
        <Moon />
    ) : (
        <Sun />
    );
};

const getNextTheme = (
    effective: ThemeSelection,
    modes: ThemeSelection[],
): ThemeSelection => {
    const i = modes.indexOf(effective);
    if (i === -1) return modes[0];
    return modes[(i + 1) % modes.length];
};

type ThemeTogglerButtonProps = React.ComponentProps<'button'> &
    VariantProps<typeof buttonVariants> & {
        modes?: ThemeSelection[];
        onImmediateChange?: ThemeTogglerPrimitiveProps['onImmediateChange'];
        direction?: ThemeTogglerPrimitiveProps['direction'];
    };

function ThemeTogglerButton({
    variant = 'default',
    size = 'default',
    // modes = ['light', 'dark', 'system'],
    modes = ['light', 'dark'],
    direction = 'ltr',
    onImmediateChange,
    onClick,
    className,
    ...props
}: ThemeTogglerButtonProps) {
    const { theme, resolvedTheme, setTheme } = useTheme();

    return (
        <ThemeTogglerPrimitive
            theme={theme as ThemeSelection}
            resolvedTheme={resolvedTheme as Resolved}
            setTheme={setTheme}
            direction={direction}
            onImmediateChange={onImmediateChange}
        >
            {({ effective, resolved, toggleTheme }) => (
                <button
                    data-slot="theme-toggler-button"
                    className={cn(buttonVariants({ variant, size, className }))}
                    onClick={(e) => {
                        onClick?.(e);
                        toggleTheme(getNextTheme(effective, modes));
                    }}
                    {...props}
                >
                    {getIcon(effective, resolved, modes)}
                </button>
            )}
        </ThemeTogglerPrimitive>
    );
}

export { ThemeTogglerButton, type ThemeTogglerButtonProps };
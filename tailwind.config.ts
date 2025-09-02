import type { Config } from "tailwindcss";

export default {
	// darkMode: ["class"], // Disabled dark mode
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
			container: {
				center: true,
				padding: {
					DEFAULT: '1rem',
					sm: '1.5rem',
					lg: '2rem',
					xl: '2rem',
					'2xl': '2rem',
				},
				screens: {
					sm: '640px',
					md: '768px',
					lg: '1024px',
					xl: '1280px',
					'2xl': '1400px'
				}
			},

			screens: {
				'xs': '320px',
				'sm': '640px',
				'md': '768px',
				'lg': '1024px',
				'xl': '1280px',
				'2xl': '1536px',
			},
		extend: {
			fontFamily: {
				// Claude-inspired typography
				'sans': ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
				'serif': ['IBM Plex Serif', 'Georgia', 'Times New Roman', 'serif'],
				'heading': ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
				'body': ['Inter', 'system-ui', '-apple-system', 'sans-serif'], 
				'display': ['IBM Plex Serif', 'Georgia', 'serif'], // For elegant headings
				'caption': ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
				// Legacy fonts (keeping for compatibility)
				'poppins': ['Poppins', 'sans-serif'],
				'quicksand': ['Quicksand', 'sans-serif'],
				'nunito': ['Nunito Sans', 'sans-serif'],
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				// Claude-inspired neutral colors
				'surface-warm': 'hsl(var(--color-surface-warm))',
				'text-primary': 'hsl(var(--color-text))',
				'text-muted': 'hsl(var(--color-text-muted))',
				'text-light': 'hsl(var(--color-text-light))',
				
				// Elegant gradients (minimal, sophisticated)
				'gradient-warm': 'linear-gradient(135deg, hsl(30, 15%, 96%), hsl(30, 15%, 94%))',
				'gradient-navy': 'linear-gradient(135deg, hsl(223, 47%, 23%), hsl(223, 47%, 35%))',
				'gradient-terracotta': 'linear-gradient(135deg, hsl(15, 65%, 60%), hsl(15, 65%, 52%))',
				
				// Data visualization (refined, professional)
				'chart-primary': 'hsl(223, 47%, 35%)',
				'chart-accent': 'hsl(15, 65%, 60%)',
				'chart-secondary': 'hsl(30, 20%, 85%)',
				'chart-success': 'hsl(142, 76%, 36%)',
				'chart-warning': 'hsl(38, 92%, 50%)'
			},
			backgroundImage: {
				// Claude-inspired minimal gradients
				'gradient-warm': 'linear-gradient(135deg, hsl(30, 15%, 96%), hsl(30, 15%, 94%))',
				'gradient-navy': 'linear-gradient(135deg, hsl(223, 47%, 23%), hsl(223, 47%, 35%))',
				'gradient-terracotta': 'linear-gradient(135deg, hsl(15, 65%, 60%), hsl(15, 65%, 52%))',
				'gradient-primary': 'linear-gradient(135deg, hsl(var(--primary)), hsl(223, 47%, 35%))',
				'gradient-accent': 'linear-gradient(135deg, hsl(var(--accent)), hsl(15, 65%, 52%))',
				'gradient-subtle': 'linear-gradient(180deg, hsl(var(--background)), hsl(var(--muted)))',
				'gradient-surface': 'linear-gradient(135deg, hsl(0, 0%, 100%), hsl(30, 15%, 96%))',
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				// Pentu-themed animations
				fadeIn: {
					'0%': { opacity: '0', transform: 'translateY(10px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' },
				},
				scaleIn: {
					'0%': { transform: 'scale(0.95)', opacity: '0' },
					'100%': { transform: 'scale(1)', opacity: '1' },
				},
				bounceGentle: {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-5px)' },
				},
				'paw-wiggle': {
					'0%, 100%': { transform: 'rotate(0deg)' },
					'25%': { transform: 'rotate(-3deg)' },
					'75%': { transform: 'rotate(3deg)' },
				},
				'puppy-bounce': {
					'0%, 100%': { transform: 'translateY(0px) scale(1)' },
					'50%': { transform: 'translateY(-8px) scale(1.05)' },
				},
				'growth-line': {
					'0%': { transform: 'scaleX(0)' },
					'100%': { transform: 'scaleX(1)' },
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fadeIn 0.3s ease-out',
				'scale-in': 'scaleIn 0.2s ease-out',
				'bounce-gentle': 'bounceGentle 2s ease-in-out infinite',
				'paw-wiggle': 'paw-wiggle 1.5s ease-in-out infinite',
				'puppy-bounce': 'puppy-bounce 2s ease-in-out infinite',
				'growth-line': 'growth-line 1s ease-out',
			}
		}
	},
		plugins: [
			require("tailwindcss-animate"),
			// Mobile optimization utilities
			function({ addUtilities }: any) {
				const newUtilities = {
					'.text-wrap': {
						'word-wrap': 'break-word',
						'word-break': 'break-word',
						'hyphens': 'auto',
						'overflow-wrap': 'break-word',
					},
					'.mobile-container': {
						'width': '100%',
						'max-width': '100vw',
						'padding-left': '1rem',
						'padding-right': '1rem',
						'margin-left': 'auto',
						'margin-right': 'auto',
						'box-sizing': 'border-box',
					},
					'.prevent-overflow': {
						'overflow-x': 'hidden',
						'max-width': '100%',
					},
					'.touch-target': {
						'min-height': '44px',
						'min-width': '44px',
						'touch-action': 'manipulation',
					},
					'.no-scrollbar': {
						'-ms-overflow-style': 'none',
						'scrollbar-width': 'none',
					},
					'.no-scrollbar::-webkit-scrollbar': {
						'display': 'none',
					},
					'.safe-area': {
						'padding-top': 'env(safe-area-inset-top)',
						'padding-bottom': 'env(safe-area-inset-bottom)',
						'padding-left': 'env(safe-area-inset-left)',
						'padding-right': 'env(safe-area-inset-right)',
					},
					'.mobile-full': {
						'width': '100vw',
						'margin-left': 'calc(-50vw + 50%)',
						'margin-right': 'calc(-50vw + 50%)',
						'padding-left': '1rem',
						'padding-right': '1rem',
					},
				}
				addUtilities(newUtilities)
			}
		],
} satisfies Config;

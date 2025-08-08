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
                sm: '1rem',
                md: '1.25rem',
                lg: '1.5rem',
                xl: '2rem',
            },
            screens: {
                '2xl': '1400px'
            }
        },
		extend: {
			fontFamily: {
				'heading': ['Poppins', 'system-ui', '-apple-system', 'sans-serif'],
				'body': ['Quicksand', 'system-ui', '-apple-system', 'sans-serif'],
				'caption': ['Nunito Sans', 'system-ui', '-apple-system', 'sans-serif'],
				'playful': ['Dancing Script', 'cursive'],
				'sans': ['Quicksand', 'Poppins', 'system-ui', '-apple-system', 'sans-serif'],
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
				// Pentu-themed colors 2025
				'primary-glow': 'hsl(var(--primary-glow))',
				'accent-light': 'hsl(var(--accent-light))',
				
				// Playful puppy gradient colors
				'gradient-mint': 'hsl(var(--gradient-mint))',
				'gradient-mint-light': 'hsl(var(--gradient-mint-light))',
				'gradient-peach': 'hsl(var(--gradient-peach))',
				'gradient-peach-light': 'hsl(var(--gradient-peach-light))',
				'gradient-sky': 'hsl(var(--gradient-sky))',
				'gradient-warm': 'hsl(var(--gradient-warm))',
				
				// Chart colors for data visualization
				'chart-growth': 'hsl(var(--chart-growth))',
				'chart-energy': 'hsl(var(--chart-energy))',
				'chart-health': 'hsl(var(--chart-health))',
				'chart-milestone': 'hsl(var(--chart-milestone))',
				'chart-joy': 'hsl(var(--chart-joy))'
			},
			backgroundImage: {
				// Playful puppy gradients 2025 🌈
				'gradient-mint': 'linear-gradient(135deg, hsl(var(--gradient-mint)), hsl(var(--gradient-mint-light)))',
				'gradient-peach': 'linear-gradient(135deg, hsl(var(--gradient-peach)), hsl(var(--gradient-peach-light)))',
				'gradient-warm': 'linear-gradient(135deg, hsl(var(--gradient-mint)), hsl(var(--gradient-peach)))',
				'gradient-sky': 'linear-gradient(180deg, hsl(var(--gradient-sky)), hsl(var(--gradient-warm)))',
				'gradient-primary': 'linear-gradient(135deg, hsl(var(--primary)), hsl(var(--primary-glow)))',
				'gradient-accent': 'linear-gradient(135deg, hsl(var(--accent)), hsl(var(--accent-light)))',
				'gradient-subtle': 'linear-gradient(180deg, hsl(var(--background)), hsl(var(--muted)))',
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
				}
				addUtilities(newUtilities)
			}
		],
} satisfies Config;

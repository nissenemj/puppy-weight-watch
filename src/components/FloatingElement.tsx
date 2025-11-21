interface FloatingElementProps {
    children: React.ReactNode
    speed?: 'normal' | 'slow'
    className?: string
}

export default function FloatingElement({
    children,
    speed = 'normal',
    className = ''
}: FloatingElementProps) {
    const animationClass = speed === 'slow' ? 'floating-slow' : 'floating'

    return (
        <div className={`${animationClass} ${className}`}>
            {children}
        </div>
    )
}

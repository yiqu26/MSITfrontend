import { ReactNode } from 'react';

interface GradientTextProps {
    children: ReactNode;
    className?: string;
    colors?: string[];
    animationSpeed?: number;
    showBorder?: boolean;
    fullWidth?: boolean;
}

export default function GradientText({
    children,
    className = "",
    colors = ["#0ea5e9", "#8b5cf6", "#10b981"],
    animationSpeed = 6,
    showBorder = false,
    fullWidth = false,
}: GradientTextProps) {
    const gradientStyle = {
        backgroundImage: `linear-gradient(to right, ${colors.join(", ")})`,
        animationDuration: `${animationSpeed}s`,
    };

    return (
        <div
            className={`relative ${fullWidth ? 'w-full' : 'mx-auto'} flex ${fullWidth ? 'w-full' : 'max-w-fit'} flex-row items-center justify-center py-2 px-3 font-medium transition-shadow duration-500 overflow-hidden ${className}`}
        >
            {showBorder && (
                <div
                    className="absolute inset-0 bg-cover z-0 pointer-events-none animate-gradient rounded-xl"
                    style={{
                        ...gradientStyle,
                        backgroundSize: "300% 100%",
                    }}
                >
                    <div
                        className="absolute inset-0 bg-white dark:bg-slate-800 rounded-xl z-[-1]"
                        style={{
                            width: "calc(100% - 4px)",
                            height: "calc(100% - 4px)",
                            left: "50%",
                            top: "50%",
                            transform: "translate(-50%, -50%)",
                        }}
                    ></div>
                </div>
            )}
            <div
                className="inline-block relative z-2 text-transparent bg-cover animate-gradient font-bold whitespace-nowrap tracking-wide"
                style={{
                    ...gradientStyle,
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    backgroundSize: "300% 100%",
                }}
            >
                {children}
            </div>
        </div>
    );
};

// tailwind.config.js
// module.exports = {
//   theme: {
//     extend: {
//       keyframes: {
//         gradient: {
//           '0%': { backgroundPosition: '0% 50%' },
//           '50%': { backgroundPosition: '100% 50%' },
//           '100%': { backgroundPosition: '0% 50%' },
//         },
//       },
//       animation: {
//         gradient: 'gradient 6s linear infinite'
//       },
//     },
//   },
//   plugins: [],
// };
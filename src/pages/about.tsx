import FallingText from '@/components/ui/Text Animations/fallingtext';

const About = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="w-full max-w-6xl h-[500px] flex items-center justify-center">
        <FallingText
          text={`好 那今天呢 風光 明媚 風和 日麗 `}
          highlightWords={["風光","風和"]}
          trigger="hover"
          backgroundColor="transparent"
          wireframes={false}
          gravity={0.56}
          fontSize="2rem"
          mouseConstraintStiffness={0.9}
        />
      </div>
    </div>
  );
};

export default About;

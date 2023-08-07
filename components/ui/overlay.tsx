import { motion } from 'framer-motion';
import { Oval } from 'react-loader-spinner';

export default function Overlay() {
  return (
    <motion.div
      className='absolute z-10 bg-background/80 backdrop-blur-sm w-full h-full inset-0 grid place-items-center'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2, ease: [0.4, 0, 0.6, 1] }}
    >
      <Oval
        height={28}
        width={28}
        color='#6366f1'
        wrapperStyle={{}}
        wrapperClass=''
        ariaLabel='oval-loading'
        secondaryColor='#6366f1'
        strokeWidth={8}
        strokeWidthSecondary={8}
      />
    </motion.div>
  );
}

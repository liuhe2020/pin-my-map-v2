import JotaiProvider from '@/components/JotaiProvider';
import ReactQueryProvider from '@/components/ReactQueryProvider';

export default function UserMapLayout({ children }: { children: React.ReactNode }) {
  return (
    <JotaiProvider>
      <ReactQueryProvider>{children}</ReactQueryProvider>
    </JotaiProvider>
  );
}

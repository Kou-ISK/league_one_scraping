import type { AppProps } from 'next/app';
import '../src/index.css';
import '../src/App.css';
import '../src/stories/header.css';
import '../src/stories/page.css';
import '../src/stories/button.css';
import '../src/stories/gameInfoTable.css';
import '../src/stories/gameDetailPage.css';
import '../src/stories/rankingPage.css';
import '../src/stories/spectatorPage.css';
import '../src/stories/scoreGraph.css';
import '../src/stories/conversionSuccessRatePieChart.css';
import '../src/stories/playerReplacementObject.css';
import { Header } from '../src/stories/Header';
import { Footer } from '../src/stories/Footer';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Header />
      <Component {...pageProps} />
      <Footer />
    </>
  );
}

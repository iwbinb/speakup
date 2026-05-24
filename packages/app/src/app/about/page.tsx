import Link from 'next/link';

import { Header } from '../../components/Header';

export const metadata = {
  title: 'About SpeakUp · Plain-English shareholder voting on Robinhood Chain',
  description:
    'Why SpeakUp exists, who it is for, and how it turns a 100-page proxy statement into a one-click vote on Robinhood Chain.',
};

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="max-w-3xl mx-auto px-6 py-12 prose-fintech">
        <p className="text-sm text-ink-500 mb-4">
          <Link href="/" className="hover:underline">
            ← Back home
          </Link>
        </p>

        <h1 className="text-4xl font-bold text-ink-900 leading-tight">
          You own the stock. You should have a say.
        </h1>

        <p className="mt-6 text-lg text-ink-700">
          SpeakUp is the first plain-English shareholder voting app built for
          the on-chain era of tokenized equities. Buy a tokenized Tesla share,
          and once a year you get to vote on who runs Tesla, how the CEO is
          paid, and whether the company should reincorporate to Texas. SpeakUp
          reads the legal materials for you, summarizes every proposal in
          three lines, recommends a vote based on your preferences, and
          records your decision on Robinhood Chain so it cannot be tampered
          with.
        </p>

        <Section title="What is a shareholder vote?">
          <p>
            Every year, every public company holds an annual meeting where
            shareholders vote on important decisions: who sits on the board,
            how executives are paid, whether to merge with another company,
            and any independent proposals raised by other shareholders.
          </p>
          <p className="mt-3">
            If you own even one share, you have a legal right to vote. In
            traditional brokerage accounts you receive a thick PDF called a
            proxy statement and you can vote through Broadridge, the company
            that handles 99% of US proxy processing. Most retail investors
            (70%) never vote, because the materials are long and dense.
          </p>
        </Section>

        <Section title="What does SpeakUp do differently?">
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Reads the proxy for you.</strong> We pull the official
              filing from the SEC EDGAR system and use a large language model
              to summarize each item in three lines you can actually read.
            </li>
            <li>
              <strong>Compares the recommendations that matter.</strong>{' '}
              Management says one thing, ISS says another, Glass Lewis a
              third. SpeakUp shows all three side by side and adds a
              personalized recommendation based on what you care about.
            </li>
            <li>
              <strong>Lets you vote with one click.</strong> Sign once. Your
              vote is recorded as an on-chain attestation on Robinhood Chain,
              which means anyone can verify how you voted and no one can
              change the record after the fact.
            </li>
            <li>
              <strong>Brings the vote back to the real world.</strong> A
              relayer service bridges on-chain attestations to Broadridge so
              the company actually counts your vote at the meeting. For the
              hackathon submission this last step is mocked; the production
              path is documented in the project repository.
            </li>
          </ul>
        </Section>

        <Section title="Why does this need to be on-chain?">
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Audit trail.</strong> Today, retail shareholders have no
              way to verify their vote was counted as cast. On-chain
              attestations make every vote independently verifiable forever.
            </li>
            <li>
              <strong>Composable.</strong> Other apps can read SpeakUp
              attestations to build voting clubs, delegation networks, or
              activist coalitions without asking permission.
            </li>
            <li>
              <strong>Tokenized stocks need it.</strong> When Robinhood,
              BlackRock, and others bring trillions in stocks on-chain over
              the next decade, the legacy proxy system breaks. SpeakUp is the
              missing governance layer for that future.
            </li>
          </ul>
        </Section>

        <Section title="Who is SpeakUp for?">
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>The 50 million Robinhood retail investors</strong> who
              will hold tokenized stocks once Robinhood Chain mainnet launches.
            </li>
            <li>
              <strong>Crypto-native shareholders</strong> who already hold
              Dinari dShares, Backed xStocks, or similar tokenized equities
              and want governance rights to mean something.
            </li>
            <li>
              <strong>Institutional issuers</strong> who want to demonstrate
              best-in-class retail participation in shareholder democracy.
            </li>
          </ul>
        </Section>

        <Section title="Is SpeakUp investment advice?">
          <p>
            No. SpeakUp summarizes filings and offers a recommendation based
            on stated user preferences, but the final vote is always cast by
            you. Nothing on this site is investment, legal, or tax advice.
          </p>
        </Section>

        <Section title="Built for the Arbitrum Open House London Buildathon">
          <p>
            SpeakUp is an open-source submission to the{' '}
            <a
              className="underline"
              href="https://www.hackquest.io/hackathons/Arbitrum-Open-House-London-Online-Buildathon"
              target="_blank"
              rel="noreferrer"
            >
              Arbitrum Open House London Online Buildathon
            </a>
            . Built on Arbitrum Orbit (Robinhood Chain), using EAS-style
            attestations, Claude AI, and EDGAR data.
          </p>
        </Section>
      </main>
    </>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-10">
      <h2 className="text-2xl font-semibold text-ink-900 mb-3">{title}</h2>
      <div className="text-ink-700 leading-relaxed">{children}</div>
    </section>
  );
}

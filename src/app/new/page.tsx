import { Container } from "@/components/Container";

export default function NewHomePage() {
  return (
    <main className="min-h-screen pt-32 pb-24">
      <Container>
        <p className="text-sm uppercase tracking-widest text-[#222222]/60">Work in progress</p>
        <h1 className="mt-4 text-4xl md:text-6xl font-semibold">The new Shortlist homepage</h1>
        <p className="mt-6 max-w-xl text-lg text-[#222222]/70">
          This page is being built here and will replace the current homepage when it&apos;s ready.
        </p>
      </Container>
    </main>
  );
}

import CallList from '@/components/call-list';

const Recordings = () => (
  <section className="flex size-full flex-col gap-8 text-white">
    <div>
      <h1 className="text-3xl font-bold">Recordings</h1>
      <p className="mt-2 text-sm text-slate-400">Recordings available for meetings in your account.</p>
    </div>
    <CallList type="recordings" />
  </section>
);

export default Recordings;

import Image from "next/image";

const Home = () => {
  return (
    <main className="mx-auto grid min-h-[calc(100vh-5rem)] w-full max-w-7xl grid-cols-1 items-center gap-10 px-5 py-10 text-white sm:px-8 md:grid-cols-2 md:gap-12 lg:px-12">
      <div className="relative mx-auto w-full max-w-xl overflow-hidden rounded-2xl">
        <Image
          src="/images/7.jpg"
          width={900}
          height={900}
          priority
          sizes="(max-width: 767px) 100vw, 50vw"
          className="h-auto max-h-[65vh] w-full object-cover"
          alt="Confo video conferencing"
        />
      </div>

      <section className="flex min-w-0 flex-col justify-center gap-5 text-center md:text-left">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-sky-300">
          Connect. Collaborate. Create.
        </p>

        <h1 className="text-5xl font-extrabold tracking-tight text-sky-400 sm:text-6xl lg:text-7xl">
          Confo
        </h1>

        <h2 className="text-2xl font-bold leading-tight text-white sm:text-3xl lg:text-4xl">
          Video conference rooms for office teams and students.
        </h2>

        <p className="mx-auto max-w-lg text-base leading-7 text-slate-300 md:mx-0">
          Bring your team together in one place for virtual meetings and
          collaboration.
        </p>
      </section>
    </main>
  );
};

export default Home;
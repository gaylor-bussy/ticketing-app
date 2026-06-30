export default function Footer({user}) {
  return (
    <>
      
        <footer className="bg-zinc-800 px-4 py-3">
        {user === null ? (  <h2 className="text-center text-base text-white sm:text-left sm:text-xl">Mode Invité</h2>) : null}
        </footer>
       
    </>
  );
}

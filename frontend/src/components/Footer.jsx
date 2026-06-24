export default function Footer({user}) {
  return (
    <>
      
        <footer className=" bg-zinc-800">
        {user === null ? (  <h2 className="text-white text-2xl">Mode Invité</h2>) : null}
        </footer>
       
    </>
  );
}

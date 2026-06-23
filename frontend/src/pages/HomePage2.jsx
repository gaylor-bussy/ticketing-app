import { Link } from "react-router-dom";
export default function HomePage2() {
  return (
    <section className="flex justify-center h-full items-center">
      <form action="" className="flex flex-col w-xl" method="post">
        <div className="my-4">
          <label className="text-white text-2xl" htmlFor="">
            Description :
          </label>
            <textarea placeholder="Success" className="textarea textarea-success"></textarea>
        </div>
        <Link to="/next">
          <button
            className="btn btn-success h-14 w-full text-2xl my-4 text-black"
            type="submit"
          >
            Envoyer la demande
          </button>
        </Link>
      </form>
    </section>
  );
}

import { serverTimestamp } from "firebase/firestore";
import PageForm from "../components/PageForm";
import { useNavigate } from "react-router-dom";

function AddPage({ onNewPageCreation }) {
  const handleSubmit = (data) => {
    onNewPageCreation({
      ...data,
      timeOpen: serverTimestamp(),
    });
  };

  return <PageForm onSubmit={handleSubmit} />;
}

export default AddPage;

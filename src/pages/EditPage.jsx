import { useParams } from "react-router-dom";
import PageForm from "../components/PageForm";

function EditPage({ listOfPages, onEditPage }) {
  const { pageId } = useParams();
  const thisPage = listOfPages.find((page) => page.id === pageId);

  const handleSubmit = (data) => {
    onEditPage({ ...data, id: thisPage.id });
  };

  return <PageForm initialData={thisPage} onSubmit={handleSubmit} />;
}

export default EditPage;
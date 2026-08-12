import { StudentProfilePage } from "../../-components/StudentProfilePage";

async function TacotsStudentProfilePage(props: { params: Promise<{ id: string }> }) {
	const { id } = await props.params;

	return <StudentProfilePage id={id} program="tacots" />;
}

export default TacotsStudentProfilePage;

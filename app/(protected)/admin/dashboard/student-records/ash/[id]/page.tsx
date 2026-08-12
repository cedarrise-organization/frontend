import { StudentProfilePage } from "../../-components/StudentProfilePage";

async function AshStudentProfilePage(props: { params: Promise<{ id: string }> }) {
	const { id } = await props.params;

	return <StudentProfilePage id={id} program="ash" />;
}

export default AshStudentProfilePage;

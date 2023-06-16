import { Routes, Route } from "react-router-dom";
import { SHomePage, SModulesPage, PHomePage, ARequest, PModulesPage, MultiOpt, PManage, PProfile, SProfile, PRequest, FreeMode, FreeModeM } from "../pages";
import { WorkEnv } from "../pages/student/WorkEnv";
import { AManage } from "../pages";
import { ASyllabus } from "../pages/admin/ASyllabus";
import { PDashboard } from "../pages/professor/PDashboard";
import { getAuth } from "firebase/auth";

export const AppRoutes = () => {
  const auth = getAuth();
  const user = auth.currentUser;
  let schoolID, email, displayName, emailVerified, uid;
  if (user !== null) {
    // Desestructuración de user
    ({ email, displayName, emailVerified, uid } = user);
    schoolID = email.substring(0, 1).toUpperCase();
  }

  const renderStudentRoutes = () => (
    <>
      <Route path="/" element={<SProfile />} />
      <Route path="student/home" element={<SHomePage />} />
      <Route path="student/modules" element={<SModulesPage />} />
      <Route path="student/modules/:group/:course" element={<SModulesPage />} />
      <Route path="student/workenv" element={<WorkEnv />} />
      <Route path="student/multiopt" element={<MultiOpt />} />
      <Route path="student/profile" element={<SProfile />} />
      <Route path="student/freemode" element={<FreeMode />} />
      <Route path="student/freemode/:course" element={<FreeModeM />} />
      <Route path="auth/login" element={<SProfile />} />
      <Route path="/*" element={<SHomePage />} />
    </>
  );

  const renderProfessorRoutes = () => (
    <>
      <Route path="/" element={<PProfile />} />
      <Route path="professor/home" element={<PHomePage />} />
      <Route path="professor/modules" element={<PModulesPage />} />
      <Route path="professor/modules/:group/:course" element={<PModulesPage />} />
      <Route path="professor/management" element={<PManage />} />
      <Route path="professor/management/:group/:course" element={<PManage />} />
      <Route path="professor/dashboard" element={<PDashboard />} />
      <Route path="professor/dashboard/:group/:course" element={<PDashboard />} />
      <Route path="professor/profile" element={<PProfile />} />
      <Route path="professor/request" element={<PRequest />} />
      <Route path="auth/login" element={<PProfile />} />
      <Route path="/*" element={<PHomePage />} />
    </>
  );

  const renderAdminRoutes = () => (
    <>
      <Route path="admin/management" element={<AManage />} />
      <Route path="admin/syllabus" element={<ASyllabus />} />
      <Route path="admin/request" element={<ARequest />} />
      <Route path="/*" element={<AManage />} />
    </>
  );

  return (
    <Routes>
      {schoolID === "A" && renderStudentRoutes()}
      {schoolID === "L" && renderProfessorRoutes()}
      {schoolID === "S" && renderAdminRoutes()}
    </Routes>
  );
};

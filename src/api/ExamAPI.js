import { api } from "./configs/axiosConfig";
import { defineCancelApiObject } from "./configs/axiosUtils";

export const ExamAPI = {
  listExams: async function (cancel = false) {
    const response = await api.request({
      url: `/method/studyai.apis.organization_exam.list_organization_exams`,
      method: "GET",
      signal: cancel
        ? cancelApiObject[this.listExams.name].handleRequestCancellation()
            .signal
        : undefined,
    });
    return response.data;
  },

  uploadFile: async function (file, cancel = false) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("is_private", 0);

    const response = await api.request({
      url: `/method/upload_file`,
      method: "POST",
      data: formData,
      headers: { "Content-Type": "multipart/form-data" },
      signal: cancel
        ? cancelApiObject[this.uploadFile.name].handleRequestCancellation()
            .signal
        : undefined,
    });
    return response.data?.message;
  },

  createExam: async function (payload, cancel = false) {
    const response = await api.request({
      url: `/method/studyai.apis.organization_exam.create_organization_exam`,
      method: "POST",
      data: payload,
      signal: cancel
        ? cancelApiObject[this.createExam.name].handleRequestCancellation()
            .signal
        : undefined,
    });
    return response.data;
  },

  assignStudents: async function (
    organizationExamId,
    assignStudents,
    cancel = false,
  ) {
    const response = await api.request({
      url: `/method/studyai.apis.organization_exam.assign_organization_exam_students`,
      method: "POST",
      data: {
        organization_exam_id: organizationExamId,
        assign_students: assignStudents,
      },
      signal: cancel
        ? cancelApiObject[
            this.assignStudents.name
          ].handleRequestCancellation().signal
        : undefined,
    });
    return response.data;
  },

  deleteExam: async function (organizationExamId, cancel = false) {
    const response = await api.request({
      url: `/method/studyai.apis.organization_exam.delete_organization_exam?organization_exam_id=${encodeURIComponent(organizationExamId)}`,
      method: "POST",
      signal: cancel
        ? cancelApiObject[this.deleteExam.name].handleRequestCancellation()
            .signal
        : undefined,
    });
    return response.data;
  },

  // template_type: "questions" | "content" | "all"
  downloadTemplateFile: function (templateType = "questions") {
    const url = `${api.defaults.baseURL}/method/studyai.apis.organization_exam.download_organization_exam_template?template_type=${templateType}&as_file=1`;
    const link = document.createElement("a");
    link.href = url;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },
};

const cancelApiObject = defineCancelApiObject(ExamAPI);

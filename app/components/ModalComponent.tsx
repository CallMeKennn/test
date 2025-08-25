import React from "react";
import Modal from "antd/es/modal/Modal";
import { useForm, SubmitHandler } from "react-hook-form";
import { useEffect } from "react";

interface Props {
  status: "create" | "edit" | null;
  isModalOpen: boolean;
  user: any;
  handleOK: (user: any) => void;
  handleCancel?: () => void;
}

type FormValues = {
  id: string;
  name: string;
  gender: string;
  address: string;
  email: string;
};

const ModalComponent = ({
  user,
  status,
  isModalOpen,
  handleOK,
  handleCancel,
}: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>({});

  useEffect(() => {
    if (status === "edit" && user) {
      reset({
        id: user.id,
        name: user.name,
        gender: user.gender,
        address: user.address,
        email: user.email,
      });
    } else if (status === "create") {
      reset({
        id: "",
        name: "",
        gender: "",
        address: "",
        email: "",
      });
    }
  }, [user, status, reset]);

  const onSubmit = (data: any) => {
    handleOK(data);
    reset({
      id: "",
      name: "",
      gender: "",
      address: "",
      email: "",
    });
  };

  return (
    <>
      <Modal
        title={status === "create" ? "Create User" : "Edit User"}
        closable={{ "aria-label": "Custom Close Button" }}
        open={isModalOpen}
        onOk={handleSubmit(onSubmit)}
        onCancel={handleCancel}
        okText={status === "create" ? "Create" : "Save"}
      >
        <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-xl">
          <h2 className="text-2xl font-semibold mb-4 text-center">User Form</h2>

          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">ID</label>
              <input
                type="text"
                {...register("id")}
                disabled
                className="w-full rounded-lg border-gray-300 bg-gray-100 text-gray-500 p-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input
                type="text"
                {...register("name", { required: "Name is required" })}
                className="w-full rounded-lg border p-2 focus:ring-2 focus:ring-blue-500"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Gender */}
            <div>
              <label className="block text-sm font-medium mb-1">Gender</label>
              <select
                {...register("gender", { required: "Please select gender" })}
                className="w-full rounded-lg border p-2 focus:ring-2 focus:ring-blue-500"
              >
                <option value="">-- Select Gender --</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              {errors.gender && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.gender.message}
                </p>
              )}
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-medium mb-1">Address</label>
              <input
                type="text"
                {...register("address", { required: "Address is required" })}
                className="w-full rounded-lg border p-2 focus:ring-2 focus:ring-blue-500"
              />
              {errors.address && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.address.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Invalid email format",
                  },
                })}
                className="w-full rounded-lg border p-2 focus:ring-2 focus:ring-blue-500"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
};

export default ModalComponent;

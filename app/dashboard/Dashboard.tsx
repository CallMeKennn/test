"use client";

import React from "react";
import { useState } from "react";
import { Card, Table, Typography } from "antd";
import { listUsers } from "../data/data";
import type { TableColumnsType } from "antd";
import { Button } from "antd";
import ModalComponent from "../components/ModalComponent";

interface TableColumnType {
  id: string;
  name: string;
  gender: string;
  email: string;
  address: string;
}

export interface User {
  id: string;
  name: string;
  gender: string;
  email: string;
  address: string;
}

const Dashboard = () => {
  const { Title } = Typography;

  const [users, setUsers] = useState<User[]>(listUsers);
  const [pageSize, setPageSize] = useState<number>(5);
  const [status, setStatus] = useState<"create" | "edit" | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [userSelection, setUserSelection] = useState(null);

  const column: TableColumnsType<TableColumnType> = [
    {
      title: "STT",
      dataIndex: "stt",
      render: (_, __, index) => index + 1,
    },
    { title: "ID User", dataIndex: "id" },
    {
      title: "Name",
      dataIndex: "name",
      sorter: (a: User, b: User) => a.name.localeCompare(b.name),
    },
    {
      title: "Gender",
      dataIndex: "gender",
    },
    {
      title: "Address",
      dataIndex: "address",
      sorter: (a: User, b: User) => a.address.localeCompare(b.address),
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Action",
      render: (item) => {
        return (
          <>
            <Button
              onClick={() => {
                setUserSelection(item);
                setStatus("edit");
                setIsModalOpen(true);
              }}
            >
              Update
            </Button>
            <Button
              onClick={() => {
                setUsers((prev: User[]) =>
                  prev.filter((user: User) => user.id !== item.id)
                );
              }}
            >
              Delete
            </Button>
          </>
        );
      },
    },
  ];

  const generateIDName = (name: string, users: User[]) => {
    const parts = name.trim().split(/\s+/);

    const lastName = parts[parts.length - 1]
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

    const initials = parts
      .slice(0, -1)
      .map((word) => word[0]?.toUpperCase())
      .join("");

    // eslint-disable-next-line prefer-const
    let baseId = `${lastName}${initials}`;
    let newId = baseId;
    let counter = 1;

    while (users.some((u) => u.id === newId)) {
      newId = `${baseId}${counter}`;
      counter++;
    }

    return newId;
  };

  const handleOK = (user: User) => {
    if (status === "create") {
      setUsers((prev: User[]) => [
        { ...user, id: generateIDName(user.name, prev) },
        ...prev,
      ]);
    } else if (status === "edit") {
      setUsers((prev: User[]) => {
        return prev.map((item: User) => {
          if (item.id === user.id) {
            const updatedUsername = generateIDName(
              user.name,
              prev.filter((u: User) => u.id !== user.id)
            );
            return { ...user, id: updatedUsername };
          }
          return item;
        });
      });
    }
    setUserSelection(null);
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setUserSelection(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <Card className="shadow-lg rounded-2xl p-4 bg-white">
        <div className="flex items-center justify-between">
          <Title level={3} className="mb-4 text-center text-blue-600">
            Danh sách người dùng
          </Title>
          <Button
            onClick={() => {
              setIsModalOpen(true);
              setStatus("create");
            }}
          >
            Create User
          </Button>
        </div>
        <Table
          columns={column}
          dataSource={users}
          rowKey="id"
          bordered
          pagination={{
            pageSize,
            showSizeChanger: true,
            pageSizeOptions: ["5", "10", "20", "50"],
            onShowSizeChange: (_, size) => setPageSize(size),
          }}
          className="rounded-lg"
        />
      </Card>

      <ModalComponent
        user={userSelection}
        status={status}
        isModalOpen={isModalOpen}
        handleOK={handleOK}
        handleCancel={handleCancel}
      />
    </div>
  );
};

export default Dashboard;

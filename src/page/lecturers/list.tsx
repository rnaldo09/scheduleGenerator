import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Popconfirm, message, Tag } from 'antd';
import LecturerForm from './crud';
import { Lecturer } from '../../types';

const LecturerTable: React.FC = () => {
  const [data, setData] = useState<Lecturer[]>([]);
  const [visible, setVisible] = useState(false);
  const [editLecturer, setEditLecturer] = useState<Lecturer | null>(null);

  useEffect(() => {
    fetchLecturers();
  }, []);

  const fetchLecturers = async () => {
    const response = await fetch('http://localhost:5000/lecturer');
    const result = await response.json();
    setData(result);
  };

  const handleCreate = async (lecturer: Lecturer) => {
    const response = await fetch('http://localhost:5000/lecturer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(lecturer),
    });
    if (response.ok) {
      message.success('Lecturer created successfully');
      fetchLecturers();
      setVisible(false);
    }
  };

  const handleEdit = async (lecturer: Lecturer) => {
    const response = await fetch(`http://localhost:5000/lecturer/${lecturer.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(lecturer),
    });
    if (response.ok) {
      message.success('Lecturer updated successfully');
      fetchLecturers();
      setVisible(false);
    }
  };

  const handleDelete = async (id: string) => {
    const response = await fetch(`http://localhost:5000/lecturer/${id}`, {
      method: 'DELETE',
    });
    if (response.ok) {
      message.success('Lecturer deleted successfully');
      fetchLecturers();
    }
  };

  const columns = [
    {
      title: 'Lecturer ID',
      dataIndex: 'lecturerId',
      key: 'lecturerId',
    },
    {
      title: 'Lecturer Name',
      dataIndex: 'lecturerName',
      key: 'lecturerName',
    },
    {
      title: 'Subjects',
      dataIndex: 'subject',
      key: 'subject',
      render: (subjects: string[]) => (
        <div>
          {subjects.map((subject: string, index: number) => (
            <Tag key={index} color="blue">{subject}</Tag> // Menampilkan subjects sebagai chips
          ))}
        </div>
      ),
    },
    {
      title: 'Availability',
      dataIndex: 'availability',
      key: 'availability',
      render: (availability: string[]) => (
        <div>
          {availability.map((day: string, index: number) => (
            <Tag key={index} color="green">
              {day.charAt(0).toUpperCase() + day.slice(1)} {/* Capitalize first letter */}
            </Tag>
          ))}
        </div>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (text: string, record: Lecturer) => (
        <Space size="middle">
          <Button onClick={() => { setEditLecturer(record); setVisible(true); }}>Edit</Button>
          <Popconfirm
            title="Are you sure to delete this lecturer?"
            onConfirm={() => handleDelete(record.lecturerId)}
          >
            <Button danger>Delete</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Button type="primary" onClick={() => { setVisible(true); setEditLecturer(null); }}>Create Lecturer</Button>
      <Table columns={columns} dataSource={data} rowKey="lecturerId" pagination={{ pageSize: 10 }} />
      <LecturerForm
        visible={visible}
        onCancel={() => setVisible(false)}
        onSubmit={editLecturer ? handleEdit : handleCreate}
        editLecturer={editLecturer || undefined}
      />
    </div>
  );
};

export default LecturerTable;

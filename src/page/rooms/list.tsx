import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Popconfirm, message } from 'antd';
import RoomForm from './crud';
import { Room } from '../../types';

const RoomTable: React.FC = () => {
  const [data, setData] = useState<Room[]>([]);
  const [visible, setVisible] = useState(false);
  const [editRoom, setEditRoom] = useState<Room | null>(null);

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    const response = await fetch('http://localhost:5000/room');
    const result = await response.json();
    setData(result);
  };

  const handleCreate = async (room: Room) => {
    const response = await fetch('http://localhost:5000/room', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(room),
    });
    if (response.ok) {
      message.success('Room created successfully');
      fetchRooms();
      setVisible(false);
    }
  };

  const handleEdit = async (room: Room) => {
    const response = await fetch(`http://localhost:5000/room/${room.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(room),
    });
    if (response.ok) {
      message.success('Room updated successfully');
      fetchRooms();
      setVisible(false);
    }
  };

  const handleDelete = async (id: string) => {
    const response = await fetch(`http://localhost:5000/room/${id}`, {
      method: 'DELETE',
    });
    if (response.ok) {
      message.success('Room deleted successfully');
      fetchRooms();
    }
  };

  const columns = [
    {
      title: 'Room Code',
      dataIndex: 'roomCode',
      key: 'roomCode',
    },
    {
      title: 'Room Name',
      dataIndex: 'roomName',
      key: 'roomName',
    },
    {
      title: 'Capacity',
      dataIndex: 'capacity',
      key: 'capacity',
    },
    {
      title: 'Room Type',
      dataIndex: 'roomType',
      key: 'roomType',
    },
    {
      title: 'Facilities',
      dataIndex: 'facility',
      key: 'facility',
      render: (facilities: string[]) => facilities.join(', '),
    },
    {
      title: 'Action',
      key: 'action',
      render: (text: string, record: Room) => (
        <Space size="middle">
          <Button onClick={() => { setEditRoom(record); setVisible(true); }}>Edit</Button>
          <Popconfirm
            title="Are you sure to delete this room?"
            onConfirm={() => handleDelete(record.id)}
          >
            <Button danger>Delete</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Button type="primary" onClick={() => { setVisible(true); setEditRoom(null); }}>Create Room</Button>
      <Table columns={columns} dataSource={data} rowKey="roomCode" pagination={{ pageSize: 10 }} />
      <RoomForm
        visible={visible}
        onCancel={() => setVisible(false)}
        onSubmit={editRoom ? handleEdit : handleCreate}
        editRoom={editRoom || undefined}
      />
    </div>
  );
};

export default RoomTable;

import React, { useState } from 'react';
import { Layout, Menu } from 'antd';
import { DashboardOutlined, ScheduleOutlined, DatabaseOutlined, ApartmentOutlined, UserOutlined, FileTextOutlined } from '@ant-design/icons';
import { Routes, Route, Link } from 'react-router-dom';  // Import Link for navigation
import Dashboard from './page/dashboard';
import RoomTable from './page/rooms/list';
import LecturerTable from './page/lecturers/list';
import BatchesTable from './page/batches/list';
import ClassSubjectTable from './page/subjects/list';
import ScheduleTable from './page/schedule/list';

const { Sider, Content } = Layout;

const App: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* Sidebar */}
      <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
        <div className="logo" />
        <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
          <Menu.Item key="1" icon={<DashboardOutlined />}>
            <Link to="/dashboard">Dashboard</Link>
          </Menu.Item>
          <Menu.Item key="2" icon={<ScheduleOutlined />}>
            <Link to="/class-schedule">Class Schedule</Link>
          </Menu.Item>
          <Menu.SubMenu key="sub1" icon={<DatabaseOutlined />} title="Data Management">
            <Menu.Item key="3" icon={<ApartmentOutlined />}>
              <Link to="/rooms">Rooms</Link>
            </Menu.Item>
            <Menu.Item key="4" icon={<UserOutlined />}>
              <Link to="/lecturers">Lecturers</Link>
            </Menu.Item>
            <Menu.Item key="5" icon={<FileTextOutlined />}>
              <Link to="/batches">Batches</Link>
            </Menu.Item>
            <Menu.Item key="6" icon={<FileTextOutlined />}>
              <Link to="/subjects">Subjects</Link>
            </Menu.Item>
          </Menu.SubMenu>
        </Menu>
      </Sider>

      {/* Main Content */}
      <Layout>
        <Content style={{ padding: '0 24px', minHeight: 280 }}>
          {/* Define the Routes for different paths */}
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/class-schedule" element={<ScheduleTable />} />
            <Route path="/rooms" element={<RoomTable />} />
            <Route path="/lecturers" element={<LecturerTable />} />
            <Route path="/batches" element={<BatchesTable />} />
            <Route path="/subjects" element={<ClassSubjectTable />} />
            <Route path="/" element={<Dashboard />} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
}

export default App;

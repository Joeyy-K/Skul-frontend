import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../../../contexts/UserContext';
import { SchoolContext } from '../context/schoolcontext';
import Cookies from 'js-cookie';
import { useParams } from 'react-router-dom';
import { X, Search } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';

const AddUsersToChannel = ({ isOpen, onClose }) => {
  const { channelId } = useParams();
  const { school } = useContext(SchoolContext);
  const currentUser = useContext(UserContext);
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const userToken = Cookies.get('userToken');

  useEffect(() => {
    if (school && school.id) {
      fetchUsers();
    }
  }, [school]);

  const fetchUsers = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/school/school/${school.id}/users/`, {
        headers: {
          'Authorization': `Token ${userToken}`,
        },
      });
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleUserSelect = (userId) => {
    setSelectedUsers((prevSelectedUsers) =>
      prevSelectedUsers.includes(userId)
        ? prevSelectedUsers.filter((id) => id !== userId)
        : [...prevSelectedUsers, userId]
    );
  };

  const handleAddUsersToChannel = async () => {
    try {
      const promises = selectedUsers.map((userId) =>
        fetch(`http://127.0.0.1:8000/school/channels/${channelId}/add_user/${userId}/`, {
          method: 'POST',
          headers: {
            'Authorization': `Token ${userToken}`,
            'Content-Type': 'application/json',
          },
        })
      );

      await Promise.all(promises);
      setSelectedUsers([]);
      onClose();
    } catch (error) {
      console.error('Error adding users to channel:', error);
    }
  };

  const filteredUsers = users
    .filter((user) => user.id !== currentUser.id)
    .filter((user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Users to Channel</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <div className="mb-4 relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="text"
              placeholder="Search users..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <ScrollArea className="h-[300px] pr-4">
            {filteredUsers.map((user) => (
              <div key={user.id} className="flex items-center space-x-2 mb-2">
                <Checkbox
                  id={`user-${user.id}`}
                  checked={selectedUsers.includes(user.id)}
                  onCheckedChange={() => handleUserSelect(user.id)}
                />
                <label
                  htmlFor={`user-${user.id}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {user.username}
                </label>
              </div>
            ))}
          </ScrollArea>
        </div>
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleAddUsersToChannel} disabled={selectedUsers.length === 0}>
            Add Users
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddUsersToChannel;
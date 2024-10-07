import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search } from 'lucide-react';

const ChannelUsersModal = ({ isOpen, onClose, channelUsers }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredUsers = channelUsers.filter((user) =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Channel Users</DialogTitle>
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
              <div key={user.id} className="py-2 px-4 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white mb-2">
                {user.username}
              </div>
            ))}
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ChannelUsersModal;
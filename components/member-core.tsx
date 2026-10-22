'use client';

import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'next/navigation';
import { ShieldCheck, UserCog, UserMinus } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { userType } from '@/components/data-for-lists/data-list';
import Loader from './Loader';
import useUser from '@/hooks/useUser';
import { toast } from './ui/use-toast';

const MemberCore = () => {
  const params = useParams();
  const roomId = Array.isArray(params.id) ? params.id[0] : String(params.id ?? '');
  const { user } = useUser();
  const [members, setMembers] = useState<userType[]>([]);
  const [adminId, setAdminId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadMembers = useCallback(async () => {
    if (!roomId) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.get('/api/member', {
        params: { id: roomId },
      });

      setMembers(response.data.members);
      setAdminId(response.data.adminId);
    } catch (error: any) {
      toast({
        description:
          error?.response?.data?.message || 'Could not load room members.',
      });
    } finally {
      setIsLoading(false);
    }
  }, [roomId]);

  useEffect(() => {
    void loadMembers();
  }, [loadMembers]);

  const handleRemove = async (userId: string) => {
    try {
      await axios.delete('/api/member', { data: { userId, id: roomId } });
      await loadMembers();
      toast({ description: 'Member removed.' });
    } catch (error: any) {
      toast({ description: error?.response?.data?.message || 'Could not remove this member.' });
    }
  };

  const handleMakeAdmin = async (userId: string) => {
    try {
      await axios.put('/api/member', { userId, id: roomId });
      await loadMembers();
      toast({ description: 'Room admin updated.' });
    } catch (error: any) {
      toast({ description: error?.response?.data?.message || 'Could not update the room admin.' });
    }
  };

  if (isLoading) return <Loader />;

  return (
    <div className="grid grid-rows-[auto_1fr] rounded-xl bg-dark-3">
      <div className="m-4 rounded-xl bg-dark-2 p-3 text-center font-semibold">Members ({members.length})</div>
      <div className="mx-4 mb-4 flex flex-col rounded-xl bg-dark-2 p-2">
        {members.map((member) => (
          <div key={member.id} className="my-1 flex items-center justify-between rounded-xl bg-dark-1 p-3 transition hover:bg-dark-4">
            <div className="min-w-0">
              <p className="truncate font-medium">{member.name || member.username || 'Confo member'}</p>
              {member.id === adminId && <span className="text-xs text-sky-300">Room admin</span>}
            </div>
            {user?.id === adminId && member.id !== user.id && (
              <DropdownMenu>
                <DropdownMenuTrigger aria-label={`Manage ${member.name || 'member'}`} className="rounded p-2 hover:bg-dark-4"><UserCog size={18} /></DropdownMenuTrigger>
                <DropdownMenuContent className="border-white/10 bg-dark-1 text-white">
                  <DropdownMenuLabel>Member settings</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => handleMakeAdmin(member.id)} className="cursor-pointer focus:bg-dark-4 focus:text-white"><ShieldCheck size={16} className="mr-2" /> Make admin</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleRemove(member.id)} className="cursor-pointer text-red-300 focus:bg-dark-4 focus:text-red-300"><UserMinus size={16} className="mr-2" /> Remove member</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        ))}
        {!members.length && <p className="p-4 text-sm text-slate-400">No members found.</p>}
      </div>
    </div>
  );
};

export default MemberCore;

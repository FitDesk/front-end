import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { PageLoader } from '@/shared/components/page-loader';
import { useAuthStore } from '@/core/store/auth.store';
import { trainerService } from '@/modules/admin/trainers/services/trainer.service';
import { TrainerDetailView } from '@/modules/admin/trainers/components/TrainerDetailView';

export default function TrainerProfilePage() {
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();

  const trainerId = useMemo(() => user?.id ?? '', [user]);

  const { data: trainer, isLoading, isError } = useQuery({
    queryKey: ['trainer-profile', trainerId],
    queryFn: async () => {
      if (!trainerId) throw new Error('No trainer id');
      return trainerService.getById(trainerId);
    },
    enabled: Boolean(trainerId),
    staleTime: 60 * 1000,
    retry: 1,
  });

  if (isLoading) return <PageLoader />;

  if (isError || !trainer) {
    return (
      <div className="p-6">
        <div className="rounded-lg border p-6 text-sm text-red-600 dark:text-red-400">
          Error cargando tu perfil. Intenta nuevamente más tarde.
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6">
      <TrainerDetailView
        trainer={trainer}
        onBack={() => navigate('/trainer/dashboard')}
      />
    </div>
  );
}



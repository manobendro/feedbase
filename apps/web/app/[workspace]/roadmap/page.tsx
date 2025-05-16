import PublicRoadmapBoard from '@/components/public-roadmap/public-board';
import RoadmapHeader from '@/components/roadmap/roadmap-header';

export default async function RoadmapPage({ params: { workspace } }: { params: { workspace: string } }) {
  return (
    <div className='absolute h-[calc(100%-3.5rem)] w-full flex-1 overflow-hidden lg:max-w-screen-xl'>
      <div className='flex h-full w-full flex-col'>
        <RoadmapHeader />
        <PublicRoadmapBoard />
      </div>
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Separator } from '@feedbase/ui/components/separator';
import { CalendarRange, CircleDashed, CircleDotDashed } from 'lucide-react';
import { STATUS_OPTIONS } from '@/lib/constants';
import useFeedback from '@/lib/swr/use-feedback';
import { FeedbackWithUserProps } from '@/lib/types';
import AnimatedTabs from '@/components/shared/animated-tabs';
import PublicFeedbackKanban from './public-kanban';

type sortingOptions = 'upvotes' | 'created' | 'trending';

export default function PublicRoadmapBoard() {
  const [tab, setTab] = useState('Status');
  const { feedback } = useFeedback(true);
  const searchParams = useSearchParams();
  const [kanbanData, setKanbanData] = useState(groupFeedbackByStatus());

  // Sort the feedback into groups based on status { 'STATUS': [feedback], ... }
  function groupFeedbackByStatus(): Record<string, FeedbackWithUserProps[]> {
    return (
      feedback?.reduce(
        (acc, curr) => {
          const status = curr.status;
          if (status) {
            if (acc[status]) {
              acc[status].push(curr);
            } else {
              acc[status] = [curr];
            }
          }
          return acc;
        },
        {} as Record<string, FeedbackWithUserProps[]>
      ) || {}
    );
  }

  Object.values(kanbanData).forEach((feedbackList) => {
    switch ((searchParams.get('sort') as sortingOptions) || 'upvotes') {
      case 'upvotes':
        feedbackList.sort((a, b) => b.upvotes - a.upvotes);
        break;
      case 'created':
        feedbackList.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      case 'trending':
        // Most upvotes & comments in the last 7 days
        feedbackList.sort((a, b) => {
          const aScore = a.upvotes + a.comment_count;
          const bScore = b.upvotes + b.comment_count;
          return bScore - aScore;
        });
    }
  });

  // Keep the kanban data in sync with the feedback data
  useEffect(() => {
    setKanbanData(groupFeedbackByStatus());
  }, [feedback]);

  return (
    <>
      {/* Header tabs */}
      <AnimatedTabs
        tabs={[
          {
            label: 'Status',
            icon: CircleDashed,
          },
          {
            label: 'Quarterly',
            icon: CalendarRange,
          },
          {
            label: 'Monthly',
            icon: CircleDotDashed,
          },
        ]}
        selectedTab={tab}
        setSelectedTab={setTab}
      />

      <Separator />

      {/* Kanban Board */}
      {kanbanData ? (
        <PublicFeedbackKanban
          data={kanbanData}
          columns={STATUS_OPTIONS}
          onDataChange={(data) => {
            //TODO: Public can't mod data
          }}
          sortedBy={(searchParams.get('sort') as sortingOptions) || 'upvotes'}
        />
      ) : null}
    </>
  );
}

// Google Analytics tracking utilities

export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || '';

// Log page views
export const pageview = (url: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_path: url,
    });
  }
};

// Log specific events
export const event = ({
  action,
  category,
  label,
  value,
}: {
  action: string;
  category: string;
  label?: string;
  value?: number;
}) => {
  if (typeof window !== 'undefined' && window.gtag) {
    const eventParams: Record<string, string | number | boolean> = {
      event_category: category,
    };
    
    if (label !== undefined) {
      eventParams.event_label = label;
    }
    
    if (value !== undefined) {
      eventParams.value = value;
    }
    
    window.gtag('event', action, eventParams);
  }
};

// Custom events for YKS Şekeri
export const trackVideoPlay = (videoTitle: string, videoId: string) => {
  event({
    action: 'video_play',
    category: 'Video',
    label: `${videoTitle} (${videoId})`,
  });
};

export const trackTopicSelect = (topicName: string, subject: string) => {
  event({
    action: 'topic_select',
    category: 'Learning',
    label: `${subject} - ${topicName}`,
  });
};

export const trackTopicComplete = (topicName: string, subject: string) => {
  event({
    action: 'topic_complete',
    category: 'Learning',
    label: `${subject} - ${topicName}`,
  });
};

export const trackPdfView = (topicName: string, subject: string) => {
  event({
    action: 'pdf_view',
    category: 'Resources',
    label: `${subject} - ${topicName}`,
  });
};

export const trackQuizStart = (topicName: string, subject: string) => {
  event({
    action: 'quiz_start',
    category: 'Quiz',
    label: `${subject} - ${topicName}`,
  });
};

export const trackDropdownOpen = (menuName: string) => {
  event({
    action: 'dropdown_open',
    category: 'Navigation',
    label: menuName,
  });
};

export const trackExternalLink = (linkName: string, url: string) => {
  event({
    action: 'external_link_click',
    category: 'Outbound',
    label: `${linkName} - ${url}`,
  });
};

// Declare gtag function for TypeScript
declare global {
  interface Window {
    gtag: (
      command: 'config' | 'event' | 'js',
      targetId: string,
      config?: Record<string, string | number | boolean>
    ) => void;
  }
}


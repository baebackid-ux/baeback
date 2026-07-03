function SkeletonBlock({ className = '', style, as: Tag = 'span' }) {
  return <Tag className={`skeleton ${className}`.trim()} style={style} aria-hidden="true" />;
}

function skeletonStyle(index) {
  return { '--skeleton-index': index };
}

export function ItemCardSkeleton({ index = 0, className = '' }) {
  return (
    <article
      className={`item-card skeleton-card ${className}`.trim()}
      style={skeletonStyle(index)}
      aria-hidden="true"
    >
      <div className="skeleton-image-wrap">
        <SkeletonBlock className="skeleton-image" as="div" />
      </div>
      <div className="item-card-body">
        <div className="skeleton-row skeleton-row--badges">
          <SkeletonBlock className="skeleton-pill skeleton-pill--wide" />
          <SkeletonBlock className="skeleton-pill" />
        </div>
        <SkeletonBlock className="skeleton-title" as="div" />
        <SkeletonBlock className="skeleton-line" as="div" />
        <SkeletonBlock className="skeleton-line skeleton-line--medium" as="div" />
        <SkeletonBlock className="skeleton-line skeleton-line--short" as="div" />
        <div className="skeleton-row skeleton-row--meta">
          <SkeletonBlock className="skeleton-chip" />
          <SkeletonBlock className="skeleton-chip" />
        </div>
        <SkeletonBlock className="skeleton-link" as="div" />
      </div>
    </article>
  );
}

export function CampaignCardSkeleton({ index = 0 }) {
  return (
    <article className="item-card campaign-card skeleton-card" style={skeletonStyle(index)} aria-hidden="true">
      <div className="skeleton-image-wrap">
        <SkeletonBlock className="skeleton-image" as="div" />
      </div>
      <div className="item-card-body">
        <div className="skeleton-row skeleton-row--badges">
          <SkeletonBlock className="skeleton-pill skeleton-pill--wide" />
          <SkeletonBlock className="skeleton-pill" />
        </div>
        <SkeletonBlock className="skeleton-title" as="div" />
        <SkeletonBlock className="skeleton-line" as="div" />
        <SkeletonBlock className="skeleton-line skeleton-line--medium" as="div" />
        <div className="skeleton-progress">
          <SkeletonBlock className="skeleton-progress-bar" as="div" />
          <div className="skeleton-row skeleton-row--progress">
            <SkeletonBlock className="skeleton-line skeleton-line--tiny" as="div" />
            <SkeletonBlock className="skeleton-line skeleton-line--tiny" as="div" />
          </div>
        </div>
        <SkeletonBlock className="skeleton-link" as="div" />
      </div>
    </article>
  );
}

export function NeedCardSkeleton({ index = 0 }) {
  return (
    <article className="need-card skeleton-card" style={skeletonStyle(index)} aria-hidden="true">
      <SkeletonBlock className="skeleton-icon" as="div" />
      <div className="skeleton-row skeleton-row--badges">
        <SkeletonBlock className="skeleton-pill skeleton-pill--wide" />
        <SkeletonBlock className="skeleton-line skeleton-line--tiny" as="div" />
      </div>
      <SkeletonBlock className="skeleton-title skeleton-title--need" as="div" />
      <SkeletonBlock className="skeleton-line" as="div" />
      <SkeletonBlock className="skeleton-line skeleton-line--medium" as="div" />
      <SkeletonBlock className="skeleton-line skeleton-line--short" as="div" />
      <div className="skeleton-row skeleton-row--footer">
        <SkeletonBlock className="skeleton-pill" />
        <SkeletonBlock className="skeleton-link" as="div" />
      </div>
    </article>
  );
}

export function RequestRowSkeleton({ index = 0 }) {
  return (
    <article className="request-row skeleton-card skeleton-row-card" style={skeletonStyle(index)} aria-hidden="true">
      <SkeletonBlock className="skeleton-avatar" as="div" />
      <div className="skeleton-row-content">
        <SkeletonBlock className="skeleton-line skeleton-line--tiny" as="div" />
        <SkeletonBlock className="skeleton-line skeleton-line--short" as="div" />
        <SkeletonBlock className="skeleton-line skeleton-line--medium" as="div" />
      </div>
      <SkeletonBlock className="skeleton-pill" />
      <SkeletonBlock className="skeleton-icon skeleton-icon--sm" as="div" />
    </article>
  );
}

export function StatCardSkeleton({ index = 0 }) {
  return (
    <div className="stat-card skeleton-card" style={skeletonStyle(index)} aria-hidden="true">
      <SkeletonBlock className="skeleton-icon skeleton-icon--stat" as="div" />
      <SkeletonBlock className="skeleton-stat-value" as="div" />
      <SkeletonBlock className="skeleton-line skeleton-line--tiny" as="div" />
    </div>
  );
}

export function DonationItemSkeleton({ index = 0 }) {
  return (
    <article className="donation-item skeleton-card" style={skeletonStyle(index)} aria-hidden="true">
      <div className="skeleton-donation-copy">
        <SkeletonBlock className="skeleton-line skeleton-line--title" as="div" />
        <SkeletonBlock className="skeleton-line skeleton-line--tiny" as="div" />
        <SkeletonBlock className="skeleton-line skeleton-line--medium" as="div" />
      </div>
      <SkeletonBlock className="skeleton-amount" as="div" />
    </article>
  );
}

export function CardGridSkeleton({ count = 4, variant = 'item', className = '' }) {
  const SkeletonComponent = variant === 'campaign' ? CampaignCardSkeleton : ItemCardSkeleton;

  return (
    <div
      className={`card-grid skeleton-grid ${className}`.trim()}
      aria-busy="true"
      aria-label="Memuat konten"
    >
      {Array.from({ length: count }, (_, index) => (
        <SkeletonComponent key={index} index={index} />
      ))}
    </div>
  );
}

export function DonationListSkeleton({ count = 4 }) {
  return (
    <div className="donation-list skeleton-grid" aria-busy="true" aria-label="Memuat riwayat donasi">
      {Array.from({ length: count }, (_, index) => (
        <DonationItemSkeleton key={index} index={index} />
      ))}
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="dashboard-skeleton" aria-busy="true" aria-label="Memuat dashboard">
      <section>
        <div className="skeleton-section-heading">
          <SkeletonBlock className="skeleton-line skeleton-line--eyebrow" as="div" />
          <SkeletonBlock className="skeleton-line skeleton-line--heading" as="div" />
        </div>
        <div className="card-grid skeleton-grid--3">
          {Array.from({ length: 3 }, (_, index) => (
            <StatCardSkeleton key={index} index={index} />
          ))}
        </div>
      </section>

      <section>
        <div className="skeleton-section-heading skeleton-section-heading--split">
          <div>
            <SkeletonBlock className="skeleton-line skeleton-line--eyebrow" as="div" />
            <SkeletonBlock className="skeleton-line skeleton-line--heading" as="div" />
          </div>
          <SkeletonBlock className="skeleton-link" as="div" />
        </div>
        <div className="mini-card-grid skeleton-grid">
          {Array.from({ length: 2 }, (_, index) => (
            <ItemCardSkeleton key={index} index={index} />
          ))}
        </div>
      </section>

      <section>
        <div className="skeleton-section-heading skeleton-section-heading--split">
          <div>
            <SkeletonBlock className="skeleton-line skeleton-line--eyebrow" as="div" />
            <SkeletonBlock className="skeleton-line skeleton-line--heading" as="div" />
          </div>
          <SkeletonBlock className="skeleton-link" as="div" />
        </div>
        <div className="request-list skeleton-grid">
          {Array.from({ length: 2 }, (_, index) => (
            <RequestRowSkeleton key={index} index={index} />
          ))}
        </div>
      </section>
    </div>
  );
}

export function SessionSkeleton() {
  return (
    <main className="container page-shell session-skeleton" aria-busy="true" aria-label="Memuat sesi">
      <div className="session-skeleton-inner">
        <SkeletonBlock className="skeleton-line skeleton-line--eyebrow" as="div" />
        <SkeletonBlock className="skeleton-line skeleton-line--hero" as="div" />
        <SkeletonBlock className="skeleton-line skeleton-line--medium" as="div" />
        <div className="card-grid skeleton-grid skeleton-grid--session">
          {Array.from({ length: 4 }, (_, index) => (
            <ItemCardSkeleton key={index} index={index} />
          ))}
        </div>
      </div>
    </main>
  );
}

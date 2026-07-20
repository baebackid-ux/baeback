export function SkeletonBlock({ className = '', style, as: Tag = 'span' }) {
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


export function CardGridSkeleton({ count = 4, className = '' }) {
  return (
    <div
      className={`card-grid skeleton-grid ${className}`.trim()}
      aria-busy="true"
      aria-label="Memuat konten"
    >
      {Array.from({ length: count }, (_, index) => (
        <ItemCardSkeleton key={index} index={index} />
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

export function ItemDetailSkeleton() {
  return (
    <div className="container detail-grid skeleton-card" aria-hidden="true" style={{ marginTop: '40px' }}>
      <div className="detail-media">
        <SkeletonBlock className="skeleton-image" as="div" style={{ height: '400px', width: '100%' }} />
      </div>
      <div className="detail-panel" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div className="skeleton-row">
          <SkeletonBlock className="skeleton-pill" />
          <SkeletonBlock className="skeleton-pill" />
        </div>
        <SkeletonBlock className="skeleton-title" as="div" style={{ height: '36px', width: '80%' }} />
        <SkeletonBlock className="skeleton-line" as="div" style={{ height: '20px', width: '100%' }} />
        <SkeletonBlock className="skeleton-line" as="div" style={{ height: '20px', width: '100%' }} />
        <SkeletonBlock className="skeleton-line" as="div" style={{ height: '20px', width: '60%' }} />
        <div className="detail-facts" style={{ display: 'flex', gap: '16px', marginTop: '20px', flexWrap: 'wrap' }}>
          <SkeletonBlock className="skeleton-chip" style={{ width: '120px', height: '40px' }} />
          <SkeletonBlock className="skeleton-chip" style={{ width: '120px', height: '40px' }} />
          <SkeletonBlock className="skeleton-chip" style={{ width: '120px', height: '40px' }} />
        </div>
        <div className="donor-card" style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '24px', padding: '16px', border: '1px solid var(--border-color, #eee)', borderRadius: '12px' }}>
          <SkeletonBlock className="skeleton-avatar" />
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <SkeletonBlock className="skeleton-line" as="div" style={{ width: '30%', height: '12px', marginBottom: 0 }} />
            <SkeletonBlock className="skeleton-line" as="div" style={{ width: '50%', height: '16px', marginBottom: 0 }} />
          </div>
        </div>
      </div>
    </div>
  );
}

export function NeedDetailSkeleton() {
  return (
    <div className="container need-detail-grid skeleton-card" aria-hidden="true" style={{ marginTop: '40px' }}>
      <div className="need-detail-story" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div className="skeleton-row">
          <SkeletonBlock className="skeleton-pill" />
          <SkeletonBlock className="skeleton-pill" />
        </div>
        <SkeletonBlock className="skeleton-title" as="div" style={{ height: '36px', width: '80%' }} />
        <SkeletonBlock className="skeleton-line" as="div" style={{ width: '30%', height: '14px' }} />
        <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <SkeletonBlock className="skeleton-line" as="div" style={{ height: '14px' }} />
          <SkeletonBlock className="skeleton-line" as="div" style={{ height: '14px' }} />
          <SkeletonBlock className="skeleton-line" as="div" style={{ height: '14px', width: '60%' }} />
        </div>
      </div>
      <div className="offer-panel" style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '24px', border: '1px solid var(--border-color, #eee)', borderRadius: '16px' }}>
        <SkeletonBlock className="skeleton-icon" as="div" style={{ width: '48px', height: '48px' }} />
        <SkeletonBlock className="skeleton-title" as="div" style={{ width: '70%', height: '24px', margin: 0 }} />
        <SkeletonBlock className="skeleton-line" as="div" style={{ width: '90%', height: '14px', margin: 0 }} />
        <div style={{ height: '120px', background: 'var(--skeleton-base, #e6ebe7)', borderRadius: '8px', margin: '12px 0' }} className="skeleton" />
        <SkeletonBlock className="skeleton-pill" style={{ width: '100%', height: '44px' }} />
      </div>
    </div>
  );
}

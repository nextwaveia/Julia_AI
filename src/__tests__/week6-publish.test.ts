import { NPMPublisher } from '../release/npm-publisher';

describe('Week 6 - npm Publish & Multi-Marketplace', () => {
  let publisher: NPMPublisher;

  beforeEach(() => {
    publisher = new NPMPublisher();
  });

  it('should publish to npm marketplace', async () => {
    const result = await publisher.publishToMarketplace('npm', 'julia-ai', '3.0.0');
    expect(result.published).toBe(true);
    expect(result.marketplace).toBe('npm');
  });

  it('should publish to 12 marketplaces', async () => {
    const results = await publisher.publishToAllMarketplaces('julia-ai', '3.0.0');
    expect(results).toHaveLength(12);
    expect(results.every((r) => r.published)).toBe(true);
  });

  it('should cover all major package managers', async () => {
    const results = await publisher.publishToAllMarketplaces('julia-ai', '3.0.0');
    const marketplaces = results.map((r) => r.marketplace);
    expect(marketplaces).toContain('npm');
    expect(marketplaces).toContain('cargo');
    expect(marketplaces).toContain('pypi');
  });

  it('should handle version updates', async () => {
    const v1 = await publisher.publishToAllMarketplaces('julia-ai', '3.0.0');
    const v2 = await publisher.publishToAllMarketplaces('julia-ai', '3.0.1');
    expect(v1).toHaveLength(12);
    expect(v2).toHaveLength(12);
    expect(v2[0].version).toBe('3.0.1');
  });

  it('should track publishing statistics', async () => {
    await publisher.publishToAllMarketplaces('julia-ai', '3.0.0');
    const stats = publisher.getPublishStats();
    expect(stats.total).toBe(12);
    expect(stats.successful).toBe(12);
    expect(stats.successRate).toBe(100);
  });

  it('should coordinate multi-platform release', async () => {
    const results = await publisher.publishToAllMarketplaces('julia-ai', '3.0.0');
    const timestamps = results.map((r) => r.timestamp);
    const spread = Math.max(...timestamps) - Math.min(...timestamps);
    expect(spread).toBeLessThan(10000);
  });
});

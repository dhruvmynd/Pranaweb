import { TechniquesList } from '@/components/techniques/techniques-list';
import { TechniquesHero } from '@/components/techniques/techniques-hero';

export function TechniquesPage() {
  return (
    <div className="min-h-screen flow-bg pt-16">
      <TechniquesHero />
      <TechniquesList />
    </div>
  );
}
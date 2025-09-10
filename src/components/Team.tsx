// src/components/Team.tsx
import { PEOPLE as people } from '@/app/constants';
import Avatar from './Avatar';

export default function Team() {
  return (
    <section id="instructors">
      <div className="bg-white px-4 py-20 sm:py-32">
        <div className="mx-auto grid max-w-7xl gap-20 px-6 lg:px-8 xl:grid-cols-3">
          <div className="max-w-xl">
            <h2 className="text-3xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-4xl">
              Meet our team
            </h2>
            <p className="mt-6 text-lg/8 text-gray-600">
              We&apos;re a dynamic team of instructors, fluent in both English
              and Arabic. All instructors have minimum 10 years of experience in
              their respective subjects.
            </p>
          </div>
          <ul
            role="list"
            className="grid gap-x-8 gap-y-12 sm:grid-cols-2 sm:gap-y-16 xl:col-span-2"
          >
            {people.map((person) => (
              <li key={person.name}>
                <div className="flex items-center gap-x-6">
                  <Avatar
                    src={person.imageUrl}
                    width={64}
                    height={64}
                    roundedFull={true}
                  />
                  <div>
                    <h3 className="text-base/7 font-semibold tracking-tight text-gray-900">
                      {person.name}
                    </h3>
                    <p className="text-sm/6 font-semibold text-indigo-600">
                      {person.role}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

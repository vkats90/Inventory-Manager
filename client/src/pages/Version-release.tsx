import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import Card from '@/components/card'

const releaseNotes = [
  {
    version: '1.0.0',
    date: '2024-06-01',
    features: ['Initial release', 'Added basic functionality for products, orders, and components'],
    fixes: ['Fixed some bugs'],
  },
  {
    version: '1.0.1',
    date: '2024-09-02',
    features: [
      'Added Supplier to Orders',
      'Added Location functionality',
      'Added user roles',
      'Added sign in with google',
      'Added search table functionality',
      'Added version release page',
      'Upgraded homepage to show a detailed dashboard',
    ],
    fixes: ['Fixed issue where filter dropdown would be cut off'],
  },
]

export default function ReleaseNotes() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <h2 className="text-2xl font-bold mb-4">Release Notes</h2>
        <Accordion type="single" collapsible className="w-full">
          {releaseNotes.map((note, index) => (
            <AccordionItem key={note.version} value={`item-${index}`}>
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center space-x-2">
                  <span className="font-semibold">{note.version}</span>
                  <Badge variant="outline">{note.date}</Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">New Features:</h4>
                    <ul className="list-disc list-inside space-y-1">
                      {note.features.map((feature, featureIndex) => (
                        <li key={featureIndex}>{feature}</li>
                      ))}
                    </ul>
                  </div>
                  {note.fixes.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2">Bug Fixes:</h4>
                      <ul className="list-disc list-inside space-y-1">
                        {note.fixes.map((fix, fixIndex) => (
                          <li key={fixIndex}>{fix}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Card>
    </div>
  )
}

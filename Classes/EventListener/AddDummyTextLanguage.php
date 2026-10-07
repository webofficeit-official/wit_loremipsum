<?php

declare(strict_types=1);

namespace Woit\WitLoremipsum\EventListener;

use TYPO3\CMS\Core\Attribute\AsEventListener;
use TYPO3\CMS\Core\Site\Entity\SiteInterface;
use TYPO3\CMS\RteCKEditor\Form\Element\Event\BeforePrepareConfigurationForEditorEvent;

/**
 * Passes the language of the edited record, taken from the site configuration,
 * to the dummy text plugin. TYPO3 itself only passes "defaultContentLanguage"
 * (fallback "en-US") for records in the default language.
 */
#[AsEventListener(identifier: 'wit-loremipsum/add-dummy-text-language')]
final readonly class AddDummyTextLanguage
{
    public function __invoke(BeforePrepareConfigurationForEditorEvent $event): void
    {
        $data = $event->getData();
        $site = $data['site'] ?? null;
        if (!$site instanceof SiteInterface) {
            return;
        }

        $languageUid = $data['databaseRow']['sys_language_uid'] ?? 0;
        if (is_array($languageUid)) {
            $languageUid = $languageUid[0] ?? 0;
        }

        try {
            $languageCode = $site->getLanguageById(max((int)$languageUid, 0))->getLocale()->getLanguageCode();
        } catch (\InvalidArgumentException) {
            return;
        }
        if ($languageCode === '') {
            return;
        }

        $configuration = $event->getConfiguration();
        $configuration['loremIpsum']['language'] ??= $languageCode;
        $event->setConfiguration($configuration);
    }
}

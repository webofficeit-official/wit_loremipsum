<?php

declare(strict_types=1);

namespace Woit\WitLoremipsum\EventListener;

use TYPO3\CMS\Core\Attribute\AsEventListener;
use TYPO3\CMS\Core\Authentication\BackendUserAuthentication;
use TYPO3\CMS\Core\Configuration\ExtensionConfiguration;
use TYPO3\CMS\Core\Core\Environment;
use TYPO3\CMS\Core\Utility\GeneralUtility;
use TYPO3\CMS\RteCKEditor\Form\Element\Event\BeforePrepareConfigurationForEditorEvent;

/**
 * Removes the dummy text button and plugin from the editor configuration
 * if the current application context or backend user is not allowed to use it.
 */
#[AsEventListener(identifier: 'wit-loremipsum/restrict-button')]
final readonly class RestrictLoremIpsumButton
{
    private const MODULE = '@woit/wit-loremipsum/lorem-ipsum.js';
    private const TOOLBAR_ITEM = 'loremIpsum';

    public function __construct(
        private ExtensionConfiguration $extensionConfiguration,
    ) {}

    public function __invoke(BeforePrepareConfigurationForEditorEvent $event): void
    {
        if ($this->isAllowed()) {
            return;
        }

        $configuration = $event->getConfiguration();

        if (is_array($configuration['importModules'] ?? null)) {
            $configuration['importModules'] = array_values(array_filter(
                $configuration['importModules'],
                static fn(mixed $module): bool => (is_array($module) ? ($module['module'] ?? '') : $module) !== self::MODULE
            ));
        }

        if (is_array($configuration['toolbar']['items'] ?? null)) {
            $configuration['toolbar']['items'] = $this->removeToolbarItem($configuration['toolbar']['items']);
        } elseif (is_array($configuration['toolbar'] ?? null) && array_is_list($configuration['toolbar'])) {
            $configuration['toolbar'] = $this->removeToolbarItem($configuration['toolbar']);
        }

        $event->setConfiguration($configuration);
    }

    private function isAllowed(): bool
    {
        $settings = (array)$this->extensionConfiguration->get('wit_loremipsum');

        $allowedContexts = GeneralUtility::trimExplode(',', (string)($settings['allowedContexts'] ?? ''), true);
        if ($allowedContexts !== [] && !$this->isContextAllowed($allowedContexts)) {
            return false;
        }

        $allowedGroups = GeneralUtility::intExplode(',', (string)($settings['allowedBackendGroups'] ?? ''), true);
        if ($allowedGroups === []) {
            return true;
        }

        $backendUser = $GLOBALS['BE_USER'] ?? null;
        if (!$backendUser instanceof BackendUserAuthentication) {
            return false;
        }
        if ((bool)($settings['alwaysAllowAdmins'] ?? true) && $backendUser->isAdmin()) {
            return true;
        }

        $userGroups = array_map('intval', $backendUser->userGroupsUID);
        return array_intersect($allowedGroups, $userGroups) !== [];
    }

    /**
     * "Development" also matches sub contexts like "Development/Local".
     */
    private function isContextAllowed(array $allowedContexts): bool
    {
        $context = (string)Environment::getContext();
        foreach ($allowedContexts as $allowedContext) {
            if ($context === $allowedContext || str_starts_with($context, $allowedContext . '/')) {
                return true;
            }
        }
        return false;
    }

    /**
     * Removes the button and cleans up separators that would be left over.
     */
    private function removeToolbarItem(array $items): array
    {
        $result = [];
        foreach ($items as $item) {
            if ($item === self::TOOLBAR_ITEM) {
                continue;
            }
            if ($item === '|' && ($result === [] || end($result) === '|')) {
                continue;
            }
            $result[] = $item;
        }
        if (end($result) === '|') {
            array_pop($result);
        }
        return $result;
    }
}

<?php

$EM_CONF[$_EXTKEY] = [
    'title' => '[WOIT] Lorem Ipsum',
    'description' => 'Ckeditor dummy lorem ipsum text.',
    'category' => 'services',
    'author' => 'Team WebofficeIT, Rahul R S',
    'author_email' => 'info@webofficeit.com',
    'author_company' => 'Weboffice Infotech India Pvt. Ltd.',
    'state' => 'stable',
    'version' => '2.1.0',
    'constraints' => [
        'depends' => [
            'php' => '8.2.0-8.99.99',
            'typo3' => '14.0.0-14.99.99',
            'rte_ckeditor' => '14.0.0-14.99.99',
        ],
        'conflicts' => [],
        'suggests' => [],
    ],
];

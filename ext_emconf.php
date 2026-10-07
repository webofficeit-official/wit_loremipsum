<?php

$EM_CONF[$_EXTKEY] = [
    'title' => 'Dummy Text for CKEditor',
    'description' => 'Toolbar button for the TYPO3 CKEditor that inserts dummy text: Lorem Ipsum or German Blindtext, as sentence, paragraphs, list or heading.',
    'category' => 'services',
    'author' => 'Sivaprasad Sisupalan',
    'author_email' => 'siva@webofficeit.com',
    'state' => 'stable',
    'version' => '2.1.2',
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

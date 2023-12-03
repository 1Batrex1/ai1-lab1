<?php

/** @var \App\Model\Car $car */
/** @var \App\Service\Router $router */

$title = 'Create Car';
$bodyClass = "edit";

ob_start(); ?>
    <h1>Create Car</h1>
    <form action="<?= $router->generatePath('car-create') ?>" method="post" class="edit-form">
        <?php require __DIR__ . DIRECTORY_SEPARATOR . '_form.html.php'; ?>
        <input type="hidden" name="action" value="car-create">
    </form>

    <a href="<?= $router->generatePath('car-index') ?>">Back to list</a>
<?php $main = ob_get_clean();

include __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'base.html.php';

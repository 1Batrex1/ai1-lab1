<?php

namespace App\Model;

use App\Service\Config;

class Car
{
  private ?int $id = null;
  private ?string $model = null;
  private ?string $description = null;

  public function getId(): ?int
  {
    return $this->id;
  }

  public function setId(?int $id): Car
  {
    $this->id = $id;

    return $this;
  }

  public function getModel(): ?string
  {
    return $this->model;
  }

  public function setModel(?string $model): Car
  {
    $this->model = $model;

    return $this;
  }

  public function getDescription(): ?string
  {
    return $this->description;
  }

  public function setDescription(?string $description): Car
  {
    $this->description = $description;

    return $this;
  }

  public static function fromArray($array): Car
  {
    $post = new self();
    $post->fill($array);

    return $post;
  }

  public function fill($array): Car
  {
    if (isset($array['id']) && !$this->getId()) {
      $this->setId($array['id']);
    }
    if (isset($array['subject'])) {
      $this->setModel($array['subject']);
    }
    if (isset($array['content'])) {
      $this->setDescription($array['content']);
    }

    return $this;
  }

  public static function findAll(): array
  {
    $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
    $sql = 'SELECT * FROM car';
    $statement = $pdo->prepare($sql);
    $statement->execute();

    $posts = [];
    $postsArray = $statement->fetchAll(\PDO::FETCH_ASSOC);
    foreach ($postsArray as $postArray) {
      $posts[] = self::fromArray($postArray);
    }

    return $posts;
  }

  public static function find($id): ?Car
  {
    $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
    $sql = 'SELECT * FROM car WHERE id = :id';
    $statement = $pdo->prepare($sql);
    $statement->execute(['id' => $id]);

    $postArray = $statement->fetch(\PDO::FETCH_ASSOC);
    if (!$postArray) {
      return null;
    }
    $post = Car::fromArray($postArray);

    return $post;
  }

  public function save(): void
  {
    $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
    if (!$this->getId()) {
      $sql = "INSERT INTO car (model, description) VALUES (:model, :description)";
      $statement = $pdo->prepare($sql);
      $statement->execute([
        'subject' => $this->getModel(),
        'content' => $this->getDescription(),
      ]);

      $this->setId($pdo->lastInsertId());
    } else {
      $sql = "UPDATE car SET model = :model, description = :description WHERE id = :id";
      $statement = $pdo->prepare($sql);
      $statement->execute([
        ':subject' => $this->getModel(),
        ':content' => $this->getDescription(),
        ':id' => $this->getId(),
      ]);
    }
  }

  public function delete(): void
  {
    $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
    $sql = "DELETE FROM car WHERE id = :id";
    $statement = $pdo->prepare($sql);
    $statement->execute([
      ':id' => $this->getId(),
    ]);

    $this->setId(null);
    $this->setModel(null);
    $this->setDescription(null);
  }
}

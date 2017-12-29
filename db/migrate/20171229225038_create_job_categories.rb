class CreateJobCategories < ActiveRecord::Migration[5.1]
  def change
    create_table :job_categories do |t|
      t.timestamps
      t.timestamp :deleted_at
      t.integer :job_id
      t.integer :category_id
    end

    add_index :job_categories, [:category_id, :job_id]
    add_index :job_categories, [:job_id, :category_id]
  end
end

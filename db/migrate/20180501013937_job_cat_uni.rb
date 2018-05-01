class JobCatUni < ActiveRecord::Migration[5.1]
  def change
    remove_index :job_categories, [:category_id, :job_id]
    remove_index :job_categories, [:job_id, :category_id]

    add_index :job_categories, [:job_id, :category_id], unique: true
  end
end

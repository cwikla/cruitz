class JobUploadUni < ActiveRecord::Migration[5.1]
  def up
    remove_index :job_uploads, name: "index_job_uploads_on_job_id_and_upload_id"
    add_index :job_uploads, [:job_id, :upload_id], unique: true
  end

  def down
    remove_index :job_uploads, [:job_id, :upload_id]
  end
end

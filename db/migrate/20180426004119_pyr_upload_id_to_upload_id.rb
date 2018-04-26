class PyrUploadIdToUploadId < ActiveRecord::Migration[5.1]
  def change
    rename_column :companies, :pyr_upload_id, :upload_id
    rename_column :users, :pyr_upload_id, :upload_id
    rename_column :candidate_uploads, :pyr_upload_id, :upload_id
    rename_column :job_uploads, :pyr_upload_id, :upload_id
  end
end
